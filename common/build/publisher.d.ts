import { Stan } from "node-nats-streaming";
import { subjectType } from "./enums";
export interface s {
    subject: subjectType;
    data: any;
}
export declare abstract class publisher<T extends s> {
    private _client;
    abstract channelName: subjectType;
    constructor(_client: Stan);
    publish(data: T['data']): Promise<void>;
}
//# sourceMappingURL=publisher.d.ts.map