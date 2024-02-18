import mongoose, {Model,Query} from "mongoose";
import jwt,{JwtPayload} from "jsonwebtoken";
export interface Pobulate {
    path: string;
    select: string;
};
export interface t {
    page?:string;
    sort?:string;
    select?:string;
    limit?:string;
    keyword?:string;
};


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

import { Request , Response , NextFunction } from "express";
import { apiError } from "./apiError";
import { apiFeatures } from "./apiFeatures";
import { subjectType } from "./enums";
// mongoose.Document.
declare global{
    namespace Express {
        interface Request {
            filterObj?: { [key:string] : string };
        }
    }
}

export interface Publisher<d> {
    publish(data:d):void;
    channelName:subjectType;
};


export interface hasId {
    _id?:any;
    version?:any;
    [ key : string] : any;
};

interface k extends mongoose.Document{
    _id?:mongoose.Types.ObjectId;
    version?:number;
    passwordChangedAt?:Date;
    active?:boolean;
    [ key : string] : any;
};


export class apiFactory <T extends mongoose.Document,m extends t,h extends hasId> {
    private publisherCreated: Publisher<h> | undefined =undefined;
    private publisherUpdated: Publisher<h> | undefined =undefined;
    private publisherDeleted: Publisher<h> | undefined =undefined;
    constructor( public model:Model<T>,public auth?:Model<k> , public options?: Pobulate ){};
    
    setPublisher( publisherCreated?: Publisher<h>,publisherUpdated?: Publisher<h>,publisherDeleted?: Publisher<h>){
        this.publisherCreated=publisherCreated;
        this.publisherUpdated=publisherUpdated;
        this.publisherDeleted=publisherDeleted;
    };

    async getOne(req:Request<{id:string},{},{},{}>,res:Response,next:NextFunction){
        let query=this.model.findOne({ _id:req.params.id }) as Query<T,T>;
        if ( this.options ) {
            query=query.populate(this.options) as Query<T,T>;
        };
        const data=await query;
        if(!data){
            return next(new apiError('doc not found',400));
        };
        res.status(200).json({data});
    };

    async createOne(req:Request,res:Response,next:NextFunction){
        let data=await this.model.create( req.body );
        if(!data){
            return next(new apiError('doc not found',400));
        };
        if(this.publisherCreated){
            this.publisherCreated.publish(data as h);
        };
        res.status(200).json({data});
    };

    async updateOne(req:Request<{id:string},{},{},{}>,res:Response,next:NextFunction){
        let data=await this.model.findByIdAndUpdate( req.params.id , req.body , {new:true} ) as T;
        if(!data){
            return next(new apiError('doc not found',400));
        };
        if(data.version || data.version === 0){
            data.version +=1;
            await data.save();
        };
        if(this.publisherUpdated){
            const emitted={ _id:data._id , version:data.version , ... req.body } as h;
            await this.publisherUpdated.publish(emitted) ;
        };
        res.status(200).json({data});
    };

    async deleteOne(req:Request<{id:string},{},{},t>,res:Response,next:NextFunction){
        let data=await this.model.findById(req.params.id);
        if(!data){
            return next(new apiError('doc not found',400));
        };
        if(data.version || data.version === 0){
            data.version +=1;
            await data.save();
        };
        await data.deleteOne()
        if(this.publisherDeleted){
            const emitted={ _id:data._id , version:data.version } as h;
            await this.publisherDeleted.publish(emitted) ;
        };
        res.status(200).json({sttus:"Deleted"});
    };

    async getAll(req:Request<{},{},{},m>,res:Response,next:NextFunction){
        let filterObj={};
        if(req.filterObj){
            filterObj=req.filterObj;
        };
        const {paginationObj,query}=await new apiFeatures< T  , m >( this.model.find() , req.query  )
            .filter(filterObj)
            .sort().select()
            .pagination();
        const data=await query;
        if(data.length == 0){
            res.status(200).json({data:[]});
        };
        res.status(200).json({data,pagination:paginationObj});
    };

    async protect(req:Request,res:Response,next:NextFunction){
        if(!this.auth){
            return next(new apiError('user model undefined',400));
        }
        let token : string|undefined;
        if( req.headers.authorization && req.headers.authorization.startsWith('bearer') ){
            token=req.headers.authorization.split(' ')[1];
        } else if ( req.cookies.jwt ){
            token=req.cookies.jwt;
        };
        if( ! token ){
            return next(new apiError('token not found',400));
        };
        const decoded=jwt.verify(token,process.env.jwt_secret!) as JwtPayload;
        const user=await this.auth.findOne({_id: decoded._id });
        if( ! user ){
            return next(new apiError('user not found',400));
        }
        if(user.passwordChangedAt){
            const timestamp=  ( (new Date(user.passwordChangedAt)).getTime() ) / 1000;
            if( timestamp > decoded.iat! ){
                return next(new apiError('login again ',400));
            };
        };
        req.user={  
                    email:decoded.email , password:decoded.password , role:decoded.role,
                    passwordChangedAt:decoded.passwordChangedAt , active:decoded.active,
                    _id:decoded._id
                };
        return next();
    };
};

export const allowedTo=( ...roles : string[]  )=>(req:Request,res:Response,next:NextFunction)=>{
    if(! roles.includes(req.user.role )){
        return next(new apiError('you are not allowed to access route',400))
    };
    return next();
};