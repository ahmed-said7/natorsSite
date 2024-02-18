import asyncHandler from "express-async-handler";
import {Request,Response,NextFunction} from "express";
import {User,UserDoc} from "../models/userModel";
import {apiError} from "@natour/common";
import jwt from "jsonwebtoken";
import * as pub from "../events/publisher";
import { WrapperModel } from "../events/natsWrapper";



import { sendMail } from "../utils/email";
import crypto from "crypto";

interface Payload  {
    _id: string;
    email: string;
    password?: string;
    role: string;
    passwordChangedAt?: Date;
    active:boolean;
}

const createToken=function(req:Request,res:Response,user:UserDoc){
    const payload:Payload={
        _id: user._id,
        email: user.email,
        password: user.password,
        role: user.role,
        passwordChangedAt: user.passwordChangedAt,
        active:user.active
    };
    console.log(process.env.jwt_secret);
    
    const token=jwt.sign(payload,process.env.jwt_secret!,{expiresIn: "20m"})
    res.cookie('jwt',token,{
        expires:new Date(Date.now()+20*60*100),
        httpOnly: true,
        secure: req.secure
    });
    res.status(200).json({token,payload});
};

export const login=asyncHandler(
    async(req:Request<{},{},{ email:string; password:string; },{}>,res:Response,next:NextFunction)=>{
        const user=await User.findOne({ email:req.body.email }).select('+password');
        if(! user ){
            return next(new apiError('User not found',400));
        };
        console.log(user);
        const match=await User.comparePassword(req.body.password,user.password);
        if(!match){
            return next(new apiError('email mismatch',400));
        };
        createToken(req, res,user);
    }
);

interface signupBody {
    email?: string;
    name?: string;
    password?: string;
    role?:string;
    photo?: string;
    active?:boolean;
};

// _id?:mongoose.Types.ObjectId;
//         name?:string;
//         email?:string;
//         role?:string;
//         photo?:string;
//         active?:string;
//         version?:number;
export const signup=asyncHandler(
    async(req:Request<{},{},signupBody,{}>,res:Response,next:NextFunction)=>{
        let user=await User.findOne({ email:req.body.email });
        if( user ){
            return next(new apiError('email should be unique',400));
        };
        user=await User.create(req.body);
        const {_id,name,active,email,role,photo,version}=user
        await new pub.userCreatedPublisher(WrapperModel.client).publish({_id,name,active,email,role,photo,version});
        createToken(req, res,user);
    }
);

export const forgetPassword = asyncHandler(
    async(req:Request<{},{},{email:string},{}>,res:Response,next:NextFunction)=>{
        let user=await User.findOne({ email:req.body.email });
        if( ! user ){
            return next(new apiError('email not found',400));
        };
        const randomCode=user.createResetToken();
        try{
            sendMail.Instance(user).sendRandomCode(randomCode);
        }catch(err) {
            user.passwordChangedAt=undefined;
            user.passwordResetToken=undefined;
            user.passwordResetTokenVertified=undefined;
            await user.save();
            return next(new apiError('error in sendMail',400));
        };
        await user.save();
        res.status(200).json({success:true,randomCode});
    }
);

export const vertifyResetToken = asyncHandler(
    async(req:Request<{},{},{resetCode:string},{}>,res:Response,next:NextFunction)=>{
        const hash=crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
        let user=await User.
            findOne({   passwordResetToken:hash , passwordResetExpiresIn : { $gt : Date.now() }   });
        if( ! user ){
            return next(new apiError('invalid random code ',400));
        };
        user.passwordResetTokenVertified = true;
        await user.save();
        res.status(200).json({success:true,user});
    }
);

export const resetPassword = asyncHandler(
    async(req:Request<{},{},{email:string; password:string},{}>,res:Response,next:NextFunction)=>{
        let user=await User.
            findOne({ email:req.body.email });
        if( ! user ){
            return next(new apiError('user not found ',400));
        };
        if(! user.passwordResetTokenVertified){
            return next(new apiError(' password reset token not vertified ',400));
        };
        user.password=req.body.password;
        user.passwordChangedAt=new Date();
        user.passwordResetToken=undefined;
        user.passwordResetTokenVertified = undefined;
        user.version += 1;
        await user.save();
        await new pub.passwordChangedPublisher(WrapperModel.client).publish({
            _id:user._id,version:user.version,
            passwordChangedAt:user.passwordChangedAt
        });
        createToken(req,res,user);
    }
);
