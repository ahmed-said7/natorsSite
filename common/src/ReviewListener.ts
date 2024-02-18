import mongoose from "mongoose";
import {Message,Stan} from "node-nats-streaming"
import { subjectType } from "./enums";
import { listener } from "./listener";
interface ReviewCreated {
    subject: subjectType.reviewCreated,
    data: {
        _id:mongoose.ObjectId;
        review?:string;
        rating?:number;
        tour?:mongoose.Types.ObjectId;
        user?:mongoose.Types.ObjectId;
        version?:number;
    };
};

interface t extends mongoose.Document{
    _id:mongoose.ObjectId;
    review?:string;
    rating?:number;
    tour?:mongoose.Types.ObjectId;
    user?:mongoose.Types.ObjectId;
    version?:number;
}

interface ReviewUpdated {
    subject: subjectType.reviewUpdated,
    data: {
        _id?:mongoose.Types.ObjectId;
        review?:string;
        rating?:number;
        tour?:mongoose.Types.ObjectId;
        user?:mongoose.Types.ObjectId;
        version?:number;
    }
}

interface reviewDeleted {
    subject: subjectType;
    data: {
        _id?:mongoose.Types.ObjectId;
        version?:number;
    };
}

export class reviewCreatedListener extends listener<ReviewCreated> {
    channelName: subjectType.reviewCreated=subjectType.reviewCreated ;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    }
    async onEvent(data: ReviewCreated['data'], msg: Message) {
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

export class reviewUpdatedListener extends listener<ReviewUpdated> {
    channelName:subjectType.reviewUpdated=subjectType.reviewUpdated;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    }
    async onEvent(data: ReviewUpdated['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            console.log(data);
            let review=await this.model.findOne({ _id : data._id , version : data.version - 1 });
            if( ! review ){
                throw new Error('review not found');
            };
            delete data._id;
            // Object.keys(data).forEach ( ( key ) => { (user as UserDoc)[key]=data[key] });
            review.updateOne({$set: data});
            await review.save();
            console.log(review);
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};

export class reviewDeletedListener extends listener<reviewDeleted> {
    channelName:subjectType.reviewDeleted=subjectType.reviewDeleted;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    };
    async onEvent(data: reviewDeleted['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            let review=await this.model.findOneAndDelete({ _id : data._id , version : data.version- 1 });
            if( ! review ){
                throw new Error('review not found');
            };
            console.log(review);
            msg.ack();
        }catch(e){
            console.log(e);
        };
    };
};