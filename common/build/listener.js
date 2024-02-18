"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listener = void 0;
;
class listener {
    constructor(_client, queueGroupName) {
        this._client = _client;
        this.queueGroupName = queueGroupName;
    }
    ;
    get client() {
        if (!this._client) {
            throw new Error('client not available');
        }
        ;
        return this._client;
    }
    ;
    options() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setDurableName(this.queueGroupName);
    }
    listen() {
        const self = this;
        const subscribtion = this.client.subscribe(this.channelName, this.queueGroupName, this.options());
        subscribtion.on('message', function (msg) {
            const data = self.parseMessage(msg);
            self.onEvent(data, msg);
        });
    }
    ;
    parseMessage(msg) {
        const data = msg.getData();
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        else {
            return data.toString('utf8');
        }
        ;
    }
    ;
}
exports.listener = listener;
;
