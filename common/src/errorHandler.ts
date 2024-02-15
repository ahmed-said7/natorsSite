import { NextFunction, Request, Response } from "express";
import { apiError } from "./apiError";
import mongoose,{ CastError } from "mongoose";

interface MongoError {
    driver?:boolean;
    code?:number;  
    name?:string;
    statusCode?:number;
    status?:string;
    errmsg:string;
    index?:string;
};

type erType = CastError| apiError | mongoose.Error.ValidationError | MongoError | any ;


const handleDuplicateError=( err : MongoError ) : apiError =>{
    const val= ( err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/) as string[] )[0];
    return new apiError(` duplicate values ${ val } `, 400);
};

const handleValidationError = ( err : mongoose.Error.ValidationError ) : apiError => {
    const values = Object.values(err.errors).map( ele => ele.message).join("&");
    return new apiError(`Validation errors: ${values} `,400);
};

const sendErrorProd=( err: apiError | any , res:Response )=>{
    if( err.isOperational ){
        res.status(err.statusCode)
        .json({ mesage:err.message , status:err.status });
    } else {
        res.status(500)
        .json({ mesage:'something went wrong ',status:'failed' });
    };
};

const sendErrorDev=( err: erType , res:Response )=>{
    return res.status(200) .
    json({ err : err })
};




export const errorHandler=function( error:erType,req:Request,res:Response,next:NextFunction ){
        console.log(error);
        if( process.env.node_env === 'development'){
            return sendErrorDev(error, res);
        }
        let objErr={ ... error };
        if( (objErr as CastError ).name == 'CastError' ){
            objErr=new apiError(`invalid mongoId value ${(error as CastError).value}`,400);
        };
        if( (objErr as MongoError).code == 11000 && (objErr as MongoError).name == 'MongoError' ){
            objErr=handleDuplicateError( error as MongoError );
        };
        if( (objErr as mongoose.Error.ValidationError ).name == 'ValidationError'){
            objErr=handleValidationError( error as mongoose.Error.ValidationError );
        };
        sendErrorProd(objErr , res);
};
