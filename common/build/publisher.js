"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publisher = void 0;
;
class publisher {
    constructor(_client) {
        this._client = _client;
    }
    ;
    publish(data) {
        return new Promise((resolve, reject) => {
            this._client.publish(this.channelName, JSON.stringify(data), function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
            // resolve();
        });
    }
    ;
}
exports.publisher = publisher;
;
