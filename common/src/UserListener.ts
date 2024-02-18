
import { Message, Stan } from "node-nats-streaming";
import mongoose from "mongoose";
import { listener } from "./listener";
import { subjectType } from "./enums";

interface userCreated {
    subject: subjectType,
    data: {
        _id:mongoose.Types.ObjectId;
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

interface t extends mongoose.Document{
    name?:string;
    email?:string;
    role?:string;
    photo?:string;
    active?:boolean;
    version:number;
    passwordChangedAt?:Date;
}

interface userDeleted {
    subject: subjectType;
    data: {
        _id?:mongoose.Types.ObjectId;
        version?:number;
    };
}

interface userPasswordChanged {
    subject: subjectType;
    data: {
        _id?:mongoose.Types.ObjectId;
        version?:number;
        passwordChangedAt?:Date;
    };
}

export class userPasswordChangedListener extends listener<userPasswordChanged> {
    channelName: subjectType=subjectType.passwordChanged;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    }
    async onEvent(data: userPasswordChanged['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            console.log(data);
            let user=await this.model.findOne({ _id : data._id , version : data.version - 1 });
            if( ! user ){
                throw new Error('User not found');
            };
            delete data._id;
            user.updateOne({$set: data});
            await user.save();
            console.log(user);
            msg.ack();
        }catch(e){
            console.log(e);
        };
    };
};

export class userCreatedListener extends listener<userCreated> {
    channelName: subjectType=subjectType.userCreated ;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    }
    async onEvent(data: userCreated['data'], msg: Message) {
        try{
            await this.model.create({ ... data , _id:data._id });
            console.log(await this.model.find());
            msg.ack();
        }catch(e){
            console.log(e);
        };
    };
};

export class userUpdatedListener extends listener<UserUpdated> {
    channelName: UserUpdated['subject']=subjectType.userUpdated;
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    };
    async onEvent(data: UserUpdated['data'], msg: Message) {
        try{
            if(!data.version){
                throw new Error('version not found');
            }
            console.log(data);
            let user=await this.model.findOne({ _id : data._id , version : data.version - 1 });
            if( ! user ){
                throw new Error('User not found');
            };
            delete data._id;
            user.updateOne({$set: data});
            await user.save();
            console.log(user);
            msg.ack();
        }catch(e){
            console.log(e);
        };
    };
};

export class userDeletedListener extends listener<userDeleted> {
    channelName:userDeleted['subject']=subjectType.userDeleted || "user:deleted";
    constructor(private model:mongoose.Model<t>,_client:Stan,queueGroupName: string){
        super(_client,queueGroupName);
    };
    async onEvent(data: UserUpdated['data'], msg: Message) {
        try{

            if(!data.version){
                throw new Error('version not found');
            }
            let user=await this.model.findOne({ _id : data._id , version : data.version- 1 }) as t;
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