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
exports.reviewDeletedListener = exports.reviewUpdatedListener = exports.reviewCreatedListener = void 0;
const enums_1 = require("./enums");
const listener_1 = require("./listener");
;
class reviewCreatedListener extends listener_1.listener {
    constructor(model, _client, queueGroupName) {
        super(_client, queueGroupName);
        this.model = model;
        this.channelName = enums_1.subjectType.reviewCreated;
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
                // throw e;
            }
            ;
        });
    }
    ;
}
exports.reviewCreatedListener = reviewCreatedListener;
;
class reviewUpdatedListener extends listener_1.listener {
    constructor(model, _client, queueGroupName) {
        super(_client, queueGroupName);
        this.model = model;
        this.channelName = enums_1.subjectType.reviewUpdated;
    }
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.version) {
                    throw new Error('version not found');
                }
                console.log(data);
                let review = yield this.model.findOne({ _id: data._id, version: data.version - 1 });
                if (!review) {
                    throw new Error('review not found');
                }
                ;
                delete data._id;
                // Object.keys(data).forEach ( ( key ) => { (user as UserDoc)[key]=data[key] });
                review.updateOne({ $set: data });
                yield review.save();
                console.log(review);
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
exports.reviewUpdatedListener = reviewUpdatedListener;
;
class reviewDeletedListener extends listener_1.listener {
    constructor(model, _client, queueGroupName) {
        super(_client, queueGroupName);
        this.model = model;
        this.channelName = enums_1.subjectType.reviewDeleted;
    }
    ;
    onEvent(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.version) {
                    throw new Error('version not found');
                }
                let review = yield this.model.findOneAndDelete({ _id: data._id, version: data.version - 1 });
                if (!review) {
                    throw new Error('review not found');
                }
                ;
                console.log(review);
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
exports.reviewDeletedListener = reviewDeletedListener;
;
