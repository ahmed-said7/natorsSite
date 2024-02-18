import { publisher , subjectType } from "@natour/common";
import mongoose from "mongoose";
import { Stan }from "node-nats-streaming";

interface userCreated {
    subject: subjectType.userCreated,
    data: {
        _id?:mongoose.Types.ObjectId;
        name?:string;
        email?:string;
        role?:string;
        photo?:string;
        active?:boolean;
        version?:number;
    }
};
interface UserUpdated {
    subject: subjectType.userUpdated,
    data: {
        _id?:mongoose.Types.ObjectId;
        name?:string;
        email?:string;
        role?:string;
        photo?:string;
        active?:boolean;
        version?:number;
    };
};
interface UserDeleted {
    subject: subjectType.userDeleted,
    data: {
        _id?:mongoose.Types.ObjectId;
        version?:number;
    };
};

interface UserPasswordChanged {
    subject: subjectType.userDeleted,
    data: {
        _id?:mongoose.Types.ObjectId;
        version?:number;
        passwordChangedAt:Date;
    };
};

export class userCreatedPublisher extends publisher<userCreated> {
    channelName: subjectType=subjectType.userCreated;
    constructor(_client:Stan){
        super(_client);
    }
};

export class userUpdatedPublisher extends publisher<UserUpdated> {
    channelName: subjectType=subjectType.userUpdated;
    constructor(_client:Stan){
        super(_client);
    }
};

export class passwordChangedPublisher extends publisher<UserPasswordChanged> {
    channelName: subjectType=subjectType.passwordChanged;
    constructor(_client:Stan){
        super(_client);
    }
};


export class userDeletedPublisher extends publisher<UserDeleted> {
    channelName: subjectType=subjectType.userDeleted;
    constructor(_client:Stan){
        super(_client);
    }
};