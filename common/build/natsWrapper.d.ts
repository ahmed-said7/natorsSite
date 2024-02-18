import * as nats from "node-nats-streaming";
import { Stan } from "node-nats-streaming";
export declare function WrapperInstance(clusterId: string, clientId: string, url: string): {
    _client: Stan | null;
    readonly client: nats.Stan;
    connect(clusterId: string, clientId: string, url: string): Promise<void>;
};
//# sourceMappingURL=natsWrapper.d.ts.map