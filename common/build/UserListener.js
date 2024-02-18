"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDeletedListener = exports.userUpdatedListener = exports.userCreatedListener = exports.userPasswordChangedListener = void 0;
const listener_1 = require("./listener");
const enums_1 = require("./enums");
class userPasswordChangedListener extends listener_1.listener {
    constructor(model, _client, queueGroupName) {
        super(_client, queueGroupName);
        this.model = model;
        this.channelName = enums_1.subjectType.passwordChanged;
    }
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.version) {
                    throw new Error('version not found');
                }
                console.log(data);
                let user = yield this.model.findOne({ _id: data._id, version: data.version - 1 });
                if (!user) {
                    throw new Error('User not found');
                }
                ;
                delete data._id;
                user.updateOne({ $set: data });
                yield user.save();
                console.log(user);
                msg.ack();
            }
            catch (e) {
                console.log(e);
            }
            ;
        });
    }
    ;
}
exports.userPasswordChangedListener = userPasswordChangedListener;
;
class userCreatedListener extends listener_1.listener {
    constructor(model, _client, queueGroupName) {
        super(_client, queueGroupName);
        this.model = model;
        this.channelName = enums_1.subjectType.userCreated;
    }
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.model.create(Object.assign(Object.assign({}, data), { _id: data._id }));
                console.log(yield this.model.find());
                msg.ack();
            }
            catch (e) {
                console.log(e);
            }
            ;
        });
    }
    ;
}
exports.userCreatedListener = userCreatedListener;
;
class userUpdatedListener extends listener_1.listener {
    constructor(model, _client, queueGroupName) {
        super(_client, queueGroupName);
        this.model = model;
        this.channelName = enums_1.subjectType.userUpdated;
    }
    ;
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.version) {
                    throw new Error('version not found');
                }
                console.log(data);
                let user = yield this.model.findOne({ _id: data._id, version: data.version - 1 });
                if (!user) {
                    throw new Error('User not found');
                }
                ;
                delete data._id;
                user.updateOne({ $set: data });
                yield user.save();
                console.log(user);
                msg.ack();
            }
            catch (e) {
                console.log(e);
            }
            ;
        });
    }
    ;
}
exports.userUpdatedListener = userUpdatedListener;
;
class userDeletedListener extends listener_1.listener {
    constructor(model, _client, queueGroupName) {
        super(_client, queueGroupName);
        this.model = model;
        this.channelName = enums_1.subjectType.userDeleted || "user:deleted";
    }
    ;
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.version) {
                    throw new Error('version not found');
                }
                let user = yield this.model.findOne({ _id: data._id, version: data.version - 1 });
                if (!user) {
                    throw new Error('User not found');
                }
                ;
                user.active = false;
                user.version += 1;
                yield user.save();
                console.log(user);
                msg.ack();
            }
            catch (e) {
                console.log(e);
                // throw e;
            }
            ;
        });
    }
    ;
}
exports.userDeletedListener = userDeletedListener;
;
