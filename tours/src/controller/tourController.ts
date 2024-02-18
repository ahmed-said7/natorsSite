import asyncHandler from "express-async-handler";
import {Request,Response,NextFunction} from "express";
import {Tour,TourDoc} from "../models/tourModel";
import {apiError,apiFactory, publisher} from "@natour/common";
import mongoose from "mongoose";


interface query {
    name?: string | object;
    duration?: number | object;
    maxGroupSize?: number | object;
    difficulty?: string | object;
    ratingsAverage?: number | object;
    ratingsQuantity?: number | object;
    price?: number | object;
    priceDiscount?: number | object;
    summary?: string | object;
    description?: string | object;
    secretTour?: boolean | object;
    page?:string;
    sort?:string;
    select?:string;
    limit?:string;
    keyword?:string;
};

interface t {
    _id: string | mongoose.Types.ObjectId
    name?: string;
    ratingsAverage?: number,
    ratingsQuantity?: number,
    summary?: string,
    description?: string,
    imageCover?: string,
    version?:number;
};
// export const setUserIds = (req:Request, res:Response, next:NextFunction) => {
//     // Allow nested routes
//     // if (! req.body.tour  ) req.body.tour = req.params.tourId;
//     // if ( ! req.body.guide ) req.body.user = req.user._id;
//     next();
// };


export const factory
    =new apiFactory<TourDoc,query,t>(Tour,{path:"reviews",select:"rating review"});
export const getTour=asyncHandler(factory.getOne.bind(factory));
export const createTour=asyncHandler(factory.createOne.bind(factory));
export const updateTour=asyncHandler(factory.updateOne.bind(factory));
export const deleteTour=asyncHandler(factory.deleteOne.bind(factory));
export const getAllTours=asyncHandler(factory.getAll.bind(factory));

export const getTourStats=asyncHandler( async (req,res,next) => {
    const stats=await Tour.aggregate([
        { $match : { ratingsAverage : { $gt:4.5 }  } },
        { $group : {
            _id : "$difficulty",
            numsOfTours: { $sum : 1  },
            avg : { $avg : "$ratingsAverage" },
            quantity : { $sum : "$ratingsQuantity" },
            minPrice : { $min:"$price" },
            avgPrice : { $avg : "$price" },
            maxPrice : { $max:"$price" }
        } },
        { $sort : { quantity : 1  } }
    ]);
    res.status(200).json({data:stats});
} );

export const getMonthlyPlans=asyncHandler( async (req:Request<{year:string},{},{},{}>,res:Response,next:NextFunction) => {
    const year=parseInt(req.params.year);
    const stats=await Tour.aggregate([
        { $unwind : "$startDates" },
        { $match: {  startDates  : {  $gte : new Date(`${year}-01-01`) , $lte : new Date(`${year}-12-31`)  }  } },
        { $group : { 
            _id : { $month : "$startDates" },
            numsOfTours: { $sum : 1  },
            tours: { $push : "$name" }
        }},
        { $addFields : { month : "$_id" } },
        { $project : { _id : 0 } }

    ]);
    res.status(200).json({data:stats});
} );

export const getTourWithin=
asyncHandler( async (req:Request<{latlng:string; distance:string; unit:string},{},{},{}>,res:Response,next:NextFunction) => {
    const { unit , distance } = req.params;
    const [ lat , lng] = req.params.latlng.split(',');
    if( !lat || !lng ){
        return next(new apiError('please provide a lat and lng',400));
    };
    const radius:number= unit === "mi" ? parseInt(distance) / 3958.8 : parseInt(distance) / 6371;
    const tours=await Tour.
        find({ startLocation : { $geoWithin : { $centerSphere : [ [lng,lat] , radius ]  } } });
    res.status(200).json({data:tours});
} );

export const getToursDistance=
asyncHandler( async (req:Request<{latlng:string; unit:string},{},{},{}>,res:Response,next:NextFunction) => {
    const { unit } = req.params;
    const [ lat , lng] = req.params.latlng.split(',');
    if( !lat || !lng ){
        return next(new apiError('please provide a lat and lng',400));
    };
    const multiplier= unit === "mi" ? 0.00062137 : .001;
    const tours=await Tour.
        aggregate([
            { $geoNear : 
            { 
                near : {  type:"Point" , coordinates : [ parseInt(lng) , parseInt(lat) ]  },
                distanceField:"distance",distanceMultiplier:multiplier
            } }
        ]);
    res.status(200).json({data:tours});
} );