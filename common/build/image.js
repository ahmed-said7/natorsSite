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
exports.resizeMultipleImages = exports.resizeSingleImage = exports.uploadMultipleImages = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = __importDefault(require("uuid"));
const sharp_1 = __importDefault(require("sharp"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiError_1 = require("./apiError");
function uploadImage() {
    const storage = multer_1.default.memoryStorage();
    const fileFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            return cb(null, true);
        }
        else {
            throw new apiError_1.apiError('Invalid file type ', 400);
            // return cb(null,false);
        }
        ;
    };
    return (0, multer_1.default)({ storage, fileFilter });
}
;
function uploadSingleImage(field) {
    return uploadImage().single(field);
}
exports.uploadSingleImage = uploadSingleImage;
;
function uploadMultipleImages(fields) {
    return uploadImage().fields(fields);
}
exports.uploadMultipleImages = uploadMultipleImages;
;
const resizeSingleImage = (field) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return next();
    let filename = `uploads-${Date.now()}-${uuid_1.default.v4()}.jpeg`;
    yield (0, sharp_1.default)(req.file.buffer).resize(700, 700).
        toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/${filename}`);
    req.body[field] = filename;
    return next();
}));
exports.resizeSingleImage = resizeSingleImage;
const customArrayOfFiles = function (files, body) {
    let filename;
    return files.map((file) => {
        filename = `uploads-${Date.now()}-${uuid_1.default.v4()}.jpeg`;
        body.push(filename);
        return (0, sharp_1.default)(file.buffer).resize(700, 700).
            toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/${filename}`);
    });
};
const resizeMultipleImages = (multiImg, singleImg) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filename;
    if (!req.files || Array.isArray(req.files)) {
        return next();
    }
    ;
    if (req.files[singleImg]) {
        filename = `uploads-${Date.now()}-${uuid_1.default.v4()}.jpeg`;
        yield (0, sharp_1.default)(req.files[singleImg][0].buffer).resize(700, 700).
            toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/${filename}`);
    }
    ;
    if (req.files[multiImg]) {
        req.body[multiImg] = [];
        const promises = customArrayOfFiles(req.files[multiImg], req.body[multiImg]);
        yield Promise.all(promises);
    }
    ;
    return next();
}));
exports.resizeMultipleImages = resizeMultipleImages;
