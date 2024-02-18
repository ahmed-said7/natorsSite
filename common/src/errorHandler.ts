import { NextFunction, Request, Response } from "express";
import { apiError } from "./apiError";
import mongoose,{ CastError } from "mongoose";

export interface MongoError {
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

const sendErrorProd=( err: any , res:Response )=>{
    if( err.isOperational ){
        return res.status(err.statusCode)
        .json({ mesage:err.message , status:err.status });
    } else {
        return res.status(500)
        .json({ mesage:'something went wrong ',status:'failed' });
    };
};

const sendErrorDev=( err: any , res:Response )=>{
    err.statusCode=err.statusCode || 400;
    err.status = err.status || 'error';
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};


export enum environment {
    development = 'development',
    production="production"
};

export const errorHandler= (env:environment)=>( error:any,req:Request,res:Response,next:NextFunction )=>{
        console.log(error);
        if( env === 'development'){
            return sendErrorDev(error, res);
        }
        let objErr={ ... error };
        if(objErr.name === 'CastError' ){
            objErr=new apiError(`invalid mongoId value ${(objErr as CastError).value}`,400);
        };
        
        if( objErr.code === 11000  ){
            objErr=handleDuplicateError( objErr );
        };
        if( objErr.name === 'ValidationError'){
            objErr=handleValidationError( objErr);
        };
        return sendErrorProd(objErr , res);
};
