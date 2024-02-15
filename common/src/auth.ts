import jwt,{JwtPayload} from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';
import asyncHandler from "express-async-handler";
import { apiError } from './apiError';
declare global{
    namespace Express {
        interface Request {
            user: 
                {   
                    _id:string;
                    email: string;
                    password: string;
                    role: string;
                    passwordChangedAt: Date;
                    active:boolean;
                }
        }
    }
}

interface payload extends JwtPayload {
    _id: string;
    email: string;
    password: string;
    role: string;
    passwordChangedAt: Date;
    active:boolean;
}
export const protect= 
asyncHandler( async (req:Request,res:Response,next:NextFunction) =>{
    let token : string|undefined;
    if( req.headers.authorization && req.headers.authorization.startsWith('bearer') ){
        token=req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt){
        token=req.cookies.jwt;
    };
    if( ! token ){
        return next(new apiError('token not found',400));
    };
    const decoded=jwt.verify(token,process.env.jwt_secret!) as payload;
    const user=
            {  
                email:decoded.email , password:decoded.password , role:decoded.role,
                passwordChangedAt:decoded.passwordChangedAt , active:decoded.active,
                _id:decoded._id
            };
    if(user.passwordChangedAt){
        const timestamp=user.passwordChangedAt.getTime() / 1000;
        if( timestamp > decoded.iat! ){
            return next(new apiError('login again ',400));
        };
    };
    // if( ! user.active ){
    //     return next(new apiError('account is not active ',400));
    // };
    req.user=user;
    return next();
});

export const allowedTo=( ...roles : string[]  )=>(req:Request,res:Response,next:NextFunction)=>{
    if(roles.includes(req.user.role)){
        return next(new apiError('you are not allowed to access route',400))
    };
};