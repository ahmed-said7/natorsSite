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
import mongoose from "mongoose";
import { Message, Stan } from "node-nats-streaming";
import { subjectType } from "./enums";
import { listener } from "./listener";
interface ReviewCreated {
    subject: subjectType.reviewCreated;
    data: {
        _id: mongoose.ObjectId;
        review?: string;
        rating?: number;
        tour?: mongoose.Types.ObjectId;
        user?: mongoose.Types.ObjectId;
        version?: number;
    };
}
interface t extends mongoose.Document {
    _id: mongoose.ObjectId;
    review?: string;
    rating?: number;
    tour?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    version?: number;
}
interface ReviewUpdated {
    subject: subjectType.reviewUpdated;
    data: {
        _id?: mongoose.Types.ObjectId;
        review?: string;
        rating?: number;
        tour?: mongoose.Types.ObjectId;
        user?: mongoose.Types.ObjectId;
        version?: number;
    };
}
interface reviewDeleted {
    subject: subjectType;
    data: {
        _id?: mongoose.Types.ObjectId;
        version?: number;
    };
}
export declare class reviewCreatedListener extends listener<ReviewCreated> {
    private model;
    channelName: subjectType.reviewCreated;
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: ReviewCreated['data'], msg: Message): Promise<void>;
}
export declare class reviewUpdatedListener extends listener<ReviewUpdated> {
    private model;
    channelName: subjectType.reviewUpdated;
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: ReviewUpdated['data'], msg: Message): Promise<void>;
}
export declare class reviewDeletedListener extends listener<reviewDeleted> {
    private model;
    channelName: subjectType.reviewDeleted;
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: reviewDeleted['data'], msg: Message): Promise<void>;
}
export {};
//# sourceMappingURL=ReviewListener.d.ts.map