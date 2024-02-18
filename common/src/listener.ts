import {Stan,Message} from "node-nats-streaming";
import { subjectType } from "./enums";

export interface l {
    subject:subjectType;
    data: any;
};


export abstract class listener<T extends l> {
    
    abstract channelName:T['subject'];
    constructor(protected _client:Stan,protected queueGroupName:string){};
    get client(){
        if( ! this._client ){
            throw new Error('client not available');
        };
        return this._client;
    };
    options(){
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setDurableName(this.queueGroupName);
    }
    listen(){
        const self=this;
        const subscribtion=this.client.subscribe(this.channelName,this.queueGroupName,this.options());
        subscribtion.on('message',function(msg:Message){
            const data=self.parseMessage(msg);
            self.onEvent(data,msg);
        });
    };
    parseMessage(msg:Message):T['data']{
        const data=msg.getData();
        if( typeof data === 'string' ){
            return JSON.parse(data);
        }
        else {
            return data.toString('utf8');
        };
    };
    abstract onEvent( data:T['data'] , msg:Message ):void;
};