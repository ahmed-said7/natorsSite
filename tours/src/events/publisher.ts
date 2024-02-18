import { publisher , subjectType } from "@natour/common";
import mongoose from "mongoose";
import { Stan }from "node-nats-streaming";



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
    }
};

interface TourUpdated {
    subject: subjectType.tourUpdated,
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

interface TourDeleted {
    subject: subjectType.tourDeleted,
    data: {
        _id:mongoose.Types.ObjectId;
        version?:number;
    };
};

export class tourCreatedPublisher extends publisher<TourCreated> {
    channelName: subjectType=subjectType.tourCreated;
    constructor(_client:Stan){
        super(_client);
    }
};

export class tourUpdatedPublisher extends publisher<TourUpdated> {
    channelName: subjectType=subjectType.tourUpdated;
    constructor(_client:Stan){
        super(_client);
    }
};

export class tourDeletedPublisher extends publisher<TourDeleted> {
    channelName: subjectType=subjectType.tourDeleted;
    constructor(_client:Stan){
        super(_client);
    }
};