import * as nats from "node-nats-streaming";
import { Stan } from "node-nats-streaming";
export function WrapperInstance(clusterId:string,clientId:string,url:string){
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
        this._client=nats.connect(clusterId,clientId,{url});
        return new Promise<void>( (resolve , reject) => {
            this.client.on( 'error'   , err => reject(err)  );
            this.client.on( 'connect' , () => resolve() );
        } );
    };
    static Instance(clusterId:string,clientId:string,url:string){
        const WrapperModel=new Wrapper();
        WrapperModel.connect(clusterId,clientId,url)
        .then( () => { console.log('connection fullfilled') } )
        .catch( (e) =>{
            console.log(e);
            throw e;
        });
        return WrapperModel;
    };
};
    return Wrapper.Instance(clusterId,clientId,url);
};