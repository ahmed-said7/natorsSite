import multer, { Field, FileFilterCallback, Multer } from "multer";
import uuid from "uuid";
import sharp from "sharp";
import { Request,NextFunction,Response } from "express";
import asyncHandler from "express-async-handler";
import { apiError } from "./apiError";


function uploadImage(){
    const storage=multer.memoryStorage();
    const fileFilter=function(req:Request,file:Express.Multer.File,cb:FileFilterCallback){
        if(file.mimetype.startsWith('image/')){
            return cb(null,true);
        }else{
            throw new apiError('Invalid file type ',400);
            // return cb(null,false);
        };
    };
    return multer({storage,fileFilter});
};

export function uploadSingleImage(field:string){
    return uploadImage().single(field);
};

export function uploadMultipleImages( fields : Field[] ){
    return uploadImage().fields(fields);
};

export const resizeSingleImage = (field:string) => asyncHandler( 
    async(req:Request,res:Response,next:NextFunction)=>{
        if(! req.file ) return next();
        let filename=`uploads-${Date.now()}-${uuid.v4()}.jpeg`;
        await sharp(req.file.buffer).resize(700,700).
            toFormat('jpeg').jpeg({quality:90}).toFile(`uploads/${filename}`);
        req.body[field]=filename;
        return next();
} );

const customArrayOfFiles =function( files:Express.Multer.File[] , body : string[] ){
    let filename:string;
    return files.map ( (file)=>{
        filename=`uploads-${Date.now()}-${uuid.v4()}.jpeg`;
        body.push(filename);
        return sharp(file.buffer).resize(700,700).
            toFormat('jpeg').jpeg({quality:90}).toFile(`uploads/${filename}`);
    });
};
export const resizeMultipleImages = (multiImg:string,singleImg:string) => asyncHandler( 
    async(req:Request,res:Response,next:NextFunction)=>{
        let filename:string;
        if( ! req.files || Array.isArray(req.files) ) {
            return next();
        };
        if ( req.files[singleImg] ){
            filename=`uploads-${Date.now()}-${uuid.v4()}.jpeg`;
            await sharp(req.files[singleImg][0].buffer).resize(700,700).
            toFormat('jpeg').jpeg({quality:90}).toFile(`uploads/${filename}`);
        };
        if(req.files[multiImg]){
            req.body[multiImg] = [];
            const promises=customArrayOfFiles( req.files[multiImg] , req.body[multiImg] );
            await Promise.all(promises);
        };
        return next();
} );