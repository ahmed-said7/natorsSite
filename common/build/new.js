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
exports.userDeletedListener = exports.userUpdatedListener = exports.userCreatedListener = void 0;
const listener_1 = require("./listener");
const enums_1 = require("./enums");
;
let User;
class userCreatedListener extends listener_1.listener {
    constructor() {
        super(...arguments);
        this.channelName = enums_1.subjectType.userCreated;
        this.queueGroupName = 'tour-services';
    }
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User.create(data);
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
exports.userCreatedListener = userCreatedListener;
;
class userUpdatedListener extends listener_1.listener {
    constructor() {
        super(...arguments);
        this.channelName = enums_1.subjectType.userUpdated;
        this.queueGroupName = 'tour-services';
    }
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.version) {
                    throw new Error('version not found');
                }
                let user = yield User.findOne({ _id: data._id, version: data.version - 1 });
                if (!user) {
                    throw new Error('User not found');
                }
                ;
                delete data._id;
                Object.keys(data).forEach((key) => { user[key] = data[key]; });
                yield user.save();
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
exports.userUpdatedListener = userUpdatedListener;
;
class userDeletedListener extends listener_1.listener {
    constructor() {
        super(...arguments);
        this.channelName = enums_1.subjectType.userDeleted;
        this.queueGroupName = 'tour-services';
    }
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.version) {
                    throw new Error('version not found');
                }
                let user = yield User.findOne({ _id: data._id, version: data.version - 1 });
                if (!user) {
                    throw new Error('User not found');
                }
                ;
                user.active = false;
                user.version += 1;
                yield user.save();
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
