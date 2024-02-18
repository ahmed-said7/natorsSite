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
    version?: number;
}
interface TourCreated {
    subject: subjectType.tourCreated;
    data: {
        _id: mongoose.Types.ObjectId;
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
        version?: number;
    };
}
interface TourUpdated {
    subject: subjectType.tourUpdated;
    data: {
        _id?: mongoose.Types.ObjectId;
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
        version?: number;
    };
}
interface TourDeleted {
    subject: subjectType.tourDeleted;
    data: {
        _id?: mongoose.Types.ObjectId;
        version?: number;
    };
}
export declare class tourCreatedListener extends listener<TourCreated> {
    private model;
    channelName: subjectType.tourCreated;
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: TourCreated['data'], msg: Message): Promise<void>;
}
export declare class tourUpdatedListener extends listener<TourUpdated> {
    private model;
    channelName: subjectType.tourUpdated;
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: TourUpdated['data'], msg: Message): Promise<void>;
}
export declare class tourDeletedListener extends listener<TourDeleted> {
    private model;
    channelName: subjectType.tourDeleted;
    constructor(model: mongoose.Model<t>, _client: Stan, queueGroupName: string);
    onEvent(data: TourDeleted['data'], msg: Message): Promise<void>;
}
export {};
//# sourceMappingURL=TourListener.d.ts.map