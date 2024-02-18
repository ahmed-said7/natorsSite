import asyncHandler from "express-async-handler";
import {Request,Response,NextFunction} from "express";
import {Review,ReviewDoc} from "../models/reviewModel";
import {apiError,apiFactory, publisher} from "@natour/common";
import mongoose from "mongoose";


interface query {
    review?:string|object;
    rating?:number|object;
    user: mongoose.Types.ObjectId|object;
    tour: mongoose.Types.ObjectId|object;
    page?:string;
    sort?:string;
    select?:string;
    limit?:string;
    keyword?:string;
};

interface t {
    _id: mongoose.Types.ObjectId
    review?:string;
    rating?:number;
    user: mongoose.Types.ObjectIdstring;
    tour: mongoose.Types.ObjectIdstring;
    version?:number;
};
export const setUserIds = (req:Request, res:Response, next:NextFunction) => {
    if ( ! req.body.user ) req.body.user = req.user._id;
    next();
};


export const factory
    =new apiFactory<ReviewDoc,query,t>(Review);
export const getReview=asyncHandler(factory.getOne.bind(factory));
export const createReview=asyncHandler(factory.createOne.bind(factory));
export const updateReview=asyncHandler(factory.updateOne.bind(factory));
export const deleteReview=asyncHandler(factory.deleteOne.bind(factory));
export const getAllReviews=asyncHandler(factory.getAll.bind(factory));