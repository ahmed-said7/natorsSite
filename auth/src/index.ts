console.log(process.env.url,process.env.clusterId);
import express from "express";
const app= express();
import {router} from "./routes/routes";
import { apiError, errorHandler,environment } from "@natour/common";
import { WrapperModel } from "./events/natsWrapper";
import * as pub from "./events/publisher";
import { factory } from "./controller/user";

app.use(express.json());
app.use("/user",router);
app.all('*',(req,res,next)=>{
    return next(new apiError('route not found',400))
});

router.use(errorHandler(environment.development));
console.log(process.env.clusterId)
if(!process.env.jwt_secret){
    throw new Error('jwt secret is required')
};

if(!process.env.clusterId){
    throw new Error('clusterId is required')
};

if(!process.env.clientId){
    throw new Error('clientId required')
};

if(!process.env.db_url){
    throw new Error('db url is required')
};

if(!process.env.url){
    throw new Error('url is required')
};

import('./config/db');

async function start(){
    try{
        
        await WrapperModel.connect(process.env.clusterId!, process.env.clientId!,process.env.url!);
        factory.setPublisher(   
            new pub.userCreatedPublisher(WrapperModel.client) ,
            new pub.userUpdatedPublisher(WrapperModel.client) ,
            new pub.userDeletedPublisher(WrapperModel.client) 
        );

    }catch (e) {
        console.log(e);
    };
    WrapperModel.client.on('close',(e)=>{
        // process.exit(1);
        console.log(e)
    })
    app.listen(5000,function(){
        console.log('listening on port 5000');
    });
};


start();

process.on('unhandledRejection',(e)=>{
    console.log(e);
    // process.exit(1);
});
process.on('uncaughtException',(e)=>{
    console.log(e);
    // process.exit(1);
});