import asyncHandler from "express-async-handler";
import { Request , Response , NextFunction } from "express";
import { User,UserDoc } from "../models/userModel";
import { apiError, apiFactory } from "@natour/common";
import mongoose from "mongoose";
import * as pub from "../events/publisher";
import { WrapperModel } from "../events/natsWrapper";

declare global{
    namespace Express {
        interface Request {
            filterObj?: { [key:string] : string };
            user:{   
                    _id: string; email: string;
                    password: string;
                    role: string;
                    passwordChangedAt: Date;
                    active:boolean;
                };
        }
    }
}

interface query {
    email?: string | object;
    name?: string | object;
    role?:string | object;
    photo?: string | object;
    active?:boolean | object;
    page?:string;
    sort?:string;
    select?:string;
    limit?:string;
    keyword?:string;
}

interface h {
    _id?:mongoose.Types.ObjectId;
    name?:string;
    email?:string;
    role?:string;
    photo?:string;
    active?:boolean;
    version?:number;
};

export const factory=new apiFactory<UserDoc,query,h>(User,undefined);




export const getUser=asyncHandler(factory.getOne.bind(factory));
export const createUser=asyncHandler(factory.createOne.bind(factory));
export const updateUser=asyncHandler(factory.updateOne.bind(factory));
// export const deleteUser=asyncHandler(factory.deleteOne.bind(factory));
export const getAllUsers=asyncHandler(factory.getAll.bind(factory));

export const getLoggedUser = asyncHandler(
    async(req:Request<{},{},{},{}>,res:Response,next:NextFunction)=>{
        const user=req.user;
        res.status(200).json({ user });
    }
);

export const deleteLoggedUser = asyncHandler(
    async(req:Request<{},{},{},{}>,res:Response,next:NextFunction)=>{
        let user=await User.findByIdAndUpdate(req.user._id,{active:false},{new:true});
        if(!user){
            return next(new apiError('user not found',400));
        };
        user.version +=1;
        await user.save();
        await new pub.userDeletedPublisher(WrapperModel.client).publish({ _id:user._id, version: user.version });
        res.status(200).json({ user });
    }
);
interface UpdateUser  { email?:string; photo?:string; name?:string; password?:string };

export const updateLoggedUser = asyncHandler(
    async(req:Request<{},{},UpdateUser,{}>,res:Response,next:NextFunction)=>{
        if(req.body.password){
            delete req.body.password;
        };
        // console.log(user);
        let user=await User.findByIdAndUpdate(req.user._id,req.body,{new:true});
        if(!user){
            return next(new apiError('user not found',400));
        };
        user.version +=1;
        await user.save();
        await new pub.userUpdatedPublisher(WrapperModel.client).publish({ ... req.body, _id:user._id, version: user.version });
        res.status(200).json({ user });
    }
);

export const updateLoggedUserPassword = asyncHandler(
    async(req:Request<{},{},{password:string},{}>,res:Response,next:NextFunction)=>{
        let user=await User.findById(req.user._id);
        if(!user){
            return next(new apiError('User not found',400));
        };
        user.password=req.body.password;
        user.passwordChangedAt=new Date();
        await user?.save();
        await new pub.passwordChangedPublisher(WrapperModel.client).publish({
            _id:user._id,version:user.version,
            passwordChangedAt:user.passwordChangedAt
        })
        res.status(200).json({ user });
    }
);

// export {factory};