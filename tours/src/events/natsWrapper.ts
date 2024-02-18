import * as nats from "node-nats-streaming";
import { Stan } from "node-nats-streaming";
class Wrapper {
    public _client: Stan|null =null;
    constructor(){};
    get client(){
        if(!this._client){
            throw new Error('client not available');
        };
        return this._client;
    };
    connect(clusterId:string,clientId:string,url:string){
        console.log(clusterId);
        this._client=nats.connect(clusterId,clientId,{url});
        return new Promise<void>( (resolve , reject) => {
            this.client.on( 'connect' , () => {resolve()} );
            this.client.on( 'error'   , (err) => {reject(err)}  );
        } );
    };
}
const WrapperModel=new Wrapper();
export {WrapperModel};

