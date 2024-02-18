/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Message, Stan } from "node-nats-streaming";
import mongoose from "mongoose";
import { listener } from "./listener";
import { subjectType } from "./enums";
interface userCreated {
    subject: subjectType;
    data: {
        _id: mongoose.Types.ObjectId;
        name?: string;
        email?: string;
        role?: string;
        photo?: string;
        active?: boolean;
        version?: number;
    };
}
interface UserUpdated {
    subject: subjectType;
    data: {
        _id?: mongoose.Types.ObjectId;
        name?: string;
        email?: string;
        role?: string;
        photo?: string;
        active?: boolean;
        version?: number;
    };
}
interface t extends mongoose.Document {
    name?: string;
    email?: string;
    role?: string;
    photo?: string;
    active?: boolean;
    version: number;
    passwordChangedAt?: Date;
}
interface userDeleted {
    subject: subjectType;
    data: {
        _id?: mongoose.Types.ObjectId;
        version?: number;
    };
}
interface userPasswordChanged {
    subject: subjectType;
    data: {
        _id?: mongoose.Types.ObjectId;
        version?: number;
        passwordChangedAt?: Date;
    };
}
export declare class userPasswordChangedListener extends listener<userPasswordChanged> {
    private model;
    channelName: subjectType;
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: userPasswordChanged['data'], msg: Message): Promise<void>;
}
export declare class userCreatedListener extends listener<userCreated> {
    private model;
    channelName: subjectType;
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: userCreated['data'], msg: Message): Promise<void>;
}
export declare class userUpdatedListener extends listener<UserUpdated> {
    private model;
    channelName: UserUpdated['subject'];
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: UserUpdated['data'], msg: Message): Promise<void>;
}
export declare class userDeletedListener extends listener<userDeleted> {
    private model;
    channelName: userDeleted['subject'];
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: UserUpdated['data'], msg: Message): Promise<void>;
}
export {};
//# sourceMappingURL=UserListener.d.ts.map