import mongoose from "mongoose";
import {Message,Stan} from "node-nats-streaming"
import { subjectType } from "./enums";
import { listener } from "./listener";

interface t extends mongoose.Document {
    name?: string;
    duration?: number;
    maxGroupSize?: number;
    difficulty?: string;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    price?: number;
    priceDiscount?: number;
    imageCover?: string;
    secretTour?: boolean;
    version?:number;
};

interface TourCreated {
    subject: subjectType.tourCreated,
    data: {
        _id:mongoose.Types.ObjectId;
        name?: string;
        duration?: number;
        maxGroupSize?: number;
        difficulty?: string;
        ratingsAverage?: number;
        ratingsQuantity?: number;
        price?: number;
        priceDiscount?: number;
        imageCover?: string;
        secretTour?: boolean;
        version?:number;
    };
};

interface TourUpdated {
    subject: subjectType.tourUpdated,
    data: {
        _id?:mongoose.Types.ObjectId;
        name?: string;
        duration?: number;
        maxGroupSize?: number;
        difficulty?: string;
        ratingsAverage?: number;
        ratingsQuantity?: number;
        price?: number;
        priceDiscount?: number;
        imageCover?: string;
        secretTour?: boolean;
        version?:number;
    };
}

interface TourDeleted {
    subject: subjectType.tourDeleted;
    data: {
        _id?:mongoose.Types.ObjectId;
        version?:number;
    };
}

export class tourCreatedListener extends listener<TourCreated> {
    channelName: subjectType.tourCreated=subjectType.tourCreated ;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    }
    async onEvent(data: TourCreated['data'],msg: Message) {
        try{
            await this.model.create({ ... data , _id:data._id });
            console.log(await this.model.find());
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};

export class tourUpdatedListener extends listener<TourUpdated> {
    channelName:subjectType.tourUpdated=subjectType.tourUpdated;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    }
    async onEvent(data: TourUpdated['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            console.log(data);
            let tour=await this.model.findOne({ _id : data._id , version : data.version - 1 });
            if( ! tour ){
                throw new Error('review not found');
            };
            delete data._id;
            // Object.keys(data).forEach ( ( key ) => { (user as UserDoc)[key]=data[key] });
            tour.updateOne({$set: data});
            await tour.save();
            console.log(tour);
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};

export class tourDeletedListener extends listener<TourDeleted> {
    channelName:subjectType.tourDeleted=subjectType.tourDeleted;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    }
    async onEvent(data: TourDeleted['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            let tour=await this.model.findOneAndDelete({ _id : data._id , version : data.version- 1 });
            if( ! tour ){
                throw new Error('tour not found');
            };
            console.log(tour);
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};