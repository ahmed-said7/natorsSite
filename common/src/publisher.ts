import {Stan} from "node-nats-streaming";
import { subjectType } from "./enums";

export interface s {
    subject:subjectType;
    data: any;
};

export abstract class publisher<T extends s> {
    abstract channelName:subjectType;
    constructor(private _client:Stan){};
    publish(data:T['data']){
        return new Promise<void>( (resolve, reject) => {
            this._client.publish(this.channelName,JSON.stringify(data),function(err){
                if(err){
                    return reject(err);
                }
                return resolve();
            });
            // resolve();
        });
    };
};