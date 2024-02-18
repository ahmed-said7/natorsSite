"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationHandler = void 0;
const express_validator_1 = require("express-validator");
const apiError_1 = require("./apiError");
const validationHandler = function (req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map((e) => e.msg).join(' & ');
        return next(new apiError_1.apiError(message, 400));
    }
    ;
    return next();
};
exports.validationHandler = validationHandler;
