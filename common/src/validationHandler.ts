import {ValidationError,validationResult} from "express-validator";
import { Request,Response,NextFunction } from "express";
import { apiError } from "./apiError";
export const validationHandler=
function( req:Request,res:Response,next:NextFunction ){
    const errors=validationResult(req) ;
    if( !errors.isEmpty() ){
        const message=errors.array().map( ( e:ValidationError ) => e.msg ).join(' & ');
        return next( new apiError(message,400) );
    };
    return next();
};
