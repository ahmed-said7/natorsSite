import express from "express";
const app= express();
import {router} from "./routes/routes";
import { apiError, errorHandler,environment } from "@natour/common";
import * as listeners from "./events/listener";
import { WrapperModel } from "./events/natsWrapper";
import { factory } from "./controller/tourController";
import { tourCreatedPublisher,tourDeletedPublisher,tourUpdatedPublisher } from "./events/publisher";

app.use(express.json());
app.use("/tour",router);

app.all('*',(req,res,next)=>{
    return next(new apiError('route not found',400))
});


router.use(errorHandler(environment.development));
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
console.log(process.env.url);
import('./config/db');

async function start(){
    try{
        await WrapperModel.connect(process.env.clusterId!, process.env.clientId!,process.env.url!);
        factory.setPublisher(
            new tourCreatedPublisher(WrapperModel.client),
            new tourUpdatedPublisher(WrapperModel.client),
            new tourDeletedPublisher(WrapperModel.client)
            )
        new listeners.userCreatedListener(WrapperModel.client).listen();
        new listeners.userDeletedListener(WrapperModel.client).listen(); 
        new listeners.userUpdatedListener(WrapperModel.client).listen();
        new listeners.reviewCreatedListener(WrapperModel.client).listen();
        new listeners.reviewUpdatedListener(WrapperModel.client).listen(); 
        new listeners.reviewDeletedListener(WrapperModel.client).listen();
    }catch (e) {
        console.log(e);
    };
    WrapperModel.client.on('close',()=>{
        process.exit();
    })
    app.listen(5001,function(){
        console.log('listening on port 5001');
    });
};


start();




process.on('unhandledRejection',(e)=>{
    console.log(e);
    process.exit(1);
});
process.on('uncaughtException',(e)=>{
    console.log(e);
    process.exit(1);
});