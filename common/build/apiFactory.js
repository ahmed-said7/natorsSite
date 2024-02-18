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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedTo = exports.apiFactory = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
;
;
const apiError_1 = require("./apiError");
const apiFeatures_1 = require("./apiFeatures");
;
;
;
class apiFactory {
    constructor(model, auth, options) {
        this.model = model;
        this.auth = auth;
        this.options = options;
        this.publisherCreated = undefined;
        this.publisherUpdated = undefined;
        this.publisherDeleted = undefined;
    }
    ;
    setPublisher(publisherCreated, publisherUpdated, publisherDeleted) {
        this.publisherCreated = publisherCreated;
        this.publisherUpdated = publisherUpdated;
        this.publisherDeleted = publisherDeleted;
    }
    ;
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.model.findOne({ _id: req.params.id });
            if (this.options) {
                query = query.populate(this.options);
            }
            ;
            const data = yield query;
            if (!data) {
                return next(new apiError_1.apiError('doc not found', 400));
            }
            ;
            res.status(200).json({ data });
        });
    }
    ;
    createOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.model.create(req.body);
            if (!data) {
                return next(new apiError_1.apiError('doc not found', 400));
            }
            ;
            if (this.publisherCreated) {
                this.publisherCreated.publish(data);
            }
            ;
            res.status(200).json({ data });
        });
    }
    ;
    updateOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!data) {
                return next(new apiError_1.apiError('doc not found', 400));
            }
            ;
            if (data.version || data.version === 0) {
                data.version += 1;
                yield data.save();
            }
            ;
            if (this.publisherUpdated) {
                const emitted = Object.assign({ _id: data._id, version: data.version }, req.body);
                yield this.publisherUpdated.publish(emitted);
            }
            ;
            res.status(200).json({ data });
        });
    }
    ;
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.model.findById(req.params.id);
            if (!data) {
                return next(new apiError_1.apiError('doc not found', 400));
            }
            ;
            if (data.version || data.version === 0) {
                data.version += 1;
                yield data.save();
            }
            ;
            yield data.deleteOne();
            if (this.publisherDeleted) {
                const emitted = { _id: data._id, version: data.version };
                yield this.publisherDeleted.publish(emitted);
            }
            ;
            res.status(200).json({ sttus: "Deleted" });
        });
    }
    ;
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let filterObj = {};
            if (req.filterObj) {
                filterObj = req.filterObj;
            }
            ;
            const { paginationObj, query } = yield new apiFeatures_1.apiFeatures(this.model.find(), req.query)
                .filter(filterObj)
                .sort().select()
                .pagination();
            const data = yield query;
            if (data.length == 0) {
                res.status(200).json({ data: [] });
            }
            ;
            res.status(200).json({ data, pagination: paginationObj });
        });
    }
    ;
    protect(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.auth) {
                return next(new apiError_1.apiError('user model undefined', 400));
            }
            let token;
            if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }
            else if (req.cookies.jwt) {
                token = req.cookies.jwt;
            }
            ;
            if (!token) {
                return next(new apiError_1.apiError('token not found', 400));
            }
            ;
            const decoded = jsonwebtoken_1.default.verify(token, process.env.jwt_secret);
            const user = yield this.auth.findOne({ _id: decoded._id });
            if (!user) {
                return next(new apiError_1.apiError('user not found', 400));
            }
            if (user.passwordChangedAt) {
                const timestamp = ((new Date(user.passwordChangedAt)).getTime()) / 1000;
                if (timestamp > decoded.iat) {
                    return next(new apiError_1.apiError('login again ', 400));
                }
                ;
            }
            ;
            req.user = {
                email: decoded.email, password: decoded.password, role: decoded.role,
                passwordChangedAt: decoded.passwordChangedAt, active: decoded.active,
                _id: decoded._id
            };
            return next();
        });
    }
    ;
}
exports.apiFactory = apiFactory;
;
const allowedTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new apiError_1.apiError('you are not allowed to access route', 400));
    }
    ;
    return next();
};
exports.allowedTo = allowedTo;
