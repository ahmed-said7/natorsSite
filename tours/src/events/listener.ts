import { listener,subjectType } from "@natour/common";
import { Message } from "node-nats-streaming";
import { User,UserDoc } from "../models/userModel";
import mongoose from "mongoose";
interface userCreated {
    subject: subjectType,
    data: {
        _id:mongoose.ObjectId;
        name?:string;
        email?:string;
        role?:string;
        photo?:string;
        active?:boolean;
        version?:number;
    }
}

interface UserUpdated {
    subject: subjectType,
    data: {
        _id?:mongoose.Types.ObjectId ;
        name?:string;
        email?:string;
        role?:string;
        photo?:string;
        active?:boolean;
        version?:number;
    }
}

interface userDeleted {
    subject: subjectType;
    data: {
        _id?:mongoose.Types.ObjectId;
        version?:number;
    };
}

export class userCreatedListener extends listener<userCreated> {
    channelName: subjectType=subjectType.userCreated ;
    queueGroupName: string='tour-services';
    async onEvent(data: userCreated['data'], msg: Message) {
        try{
            await User.create({ ... data , _id:data._id });
            console.log(await User.find());
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};

export class userUpdatedListener extends listener<UserUpdated> {
    channelName: UserUpdated['subject']=subjectType.userUpdated;
    queueGroupName: string='tour-services';
    async onEvent(data: UserUpdated['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            console.log(data);
            let user=await User.findOne({ _id : data._id , version : data.version - 1 });
            if( ! user ){
                throw new Error('User not found');
            };
            delete data._id;
            // Object.keys(data).forEach ( ( key ) => { (user as UserDoc)[key]=data[key] });
            user.updateOne({$set: data});
            await user.save();
            console.log(user);
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};

export class userDeletedListener extends listener<userDeleted> {
    channelName:userDeleted['subject']=subjectType.userDeleted || "user:deleted";
    queueGroupName: string='tour-services';
    async onEvent(data: UserUpdated['data'], msg: Message) {
        try{

            if(!data.version){
                throw new Error('version not found');
            }
            let user=await User.findOne({ _id : data._id , version : data.version- 1 });
            if( ! user ){
                throw new Error('User not found');
            };
            user.active = false;
            user.version += 1;
            await user.save();
            console.log(user);
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};


import { Review } from "../models/reviewModel";

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
    queueGroupName: string='tour-services';
    async onEvent(data: ReviewCreated['data'], msg: Message) {
        try{
            await Review.create({ ... data , _id:data._id });
            console.log(await Review.find());
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};

export class reviewUpdatedListener extends listener<ReviewUpdated> {
    channelName:subjectType.reviewUpdated=subjectType.reviewUpdated;
    queueGroupName: string='tour-services';
    async onEvent(data: ReviewUpdated['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            console.log(data);
            let review=await Review.findOne({ _id : data._id , version : data.version - 1 });
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
    queueGroupName: string='tour-services';
    async onEvent(data: reviewDeleted['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            let review=await User.findOneAndDelete({ _id : data._id , version : data.version- 1 });
            if( ! review ){
                throw new Error('review not found');
            };
            console.log(review);
            msg.ack();
        }catch(e){
            console.log(e);
            // throw e;
        };
    };
};