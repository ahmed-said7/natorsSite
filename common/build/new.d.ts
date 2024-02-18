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
import { listener } from "./listener";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { subjectType } from "./enums";
interface userCreated {
    subject: subjectType.userCreated;
    data: {
        name?: string;
        email?: string;
        role?: string;
        photo?: string;
        active?: boolean;
        version?: number;
    };
}
interface UserUpdated {
    subject: subjectType.userUpdated;
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
interface UserDeleted {
    subject: subjectType.userDeleted;
    data: {
        _id?: mongoose.Types.ObjectId;
        version?: number;
    };
}
export declare class userCreatedListener extends listener<userCreated> {
    channelName: subjectType.userCreated;
    queueGroupName: string;
    onEvent(data: userCreated['data'], msg: Message): Promise<void>;
}
export declare class userUpdatedListener extends listener<UserUpdated> {
    channelName: subjectType.userUpdated;
    queueGroupName: string;
    onEvent(data: UserUpdated['data'], msg: Message): Promise<void>;
}
export declare class userDeletedListener extends listener<UserDeleted> {
    channelName: subjectType.userDeleted;
    queueGroupName: string;
    onEvent(data: UserUpdated['data'], msg: Message): Promise<void>;
}
export {};
//# sourceMappingURL=new.d.ts.map