"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.environment = void 0;
const apiError_1 = require("./apiError");
;
const handleDuplicateError = (err) => {
    const val = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    return new apiError_1.apiError(` duplicate values ${val} `, 400);
};
const handleValidationError = (err) => {
    const values = Object.values(err.errors).map(ele => ele.message).join("&");
    return new apiError_1.apiError(`Validation errors: ${values} `, 400);
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode)
            .json({ mesage: err.message, status: err.status });
    }
    else {
        return res.status(500)
            .json({ mesage: 'something went wrong ', status: 'failed' });
    }
    ;
};
const sendErrorDev = (err, res) => {
    err.statusCode = err.statusCode || 400;
    err.status = err.status || 'error';
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
var environment;
(function (environment) {
    environment["development"] = "development";
    environment["production"] = "production";
})(environment || (exports.environment = environment = {}));
;
const errorHandler = (env) => (error, req, res, next) => {
    console.log(error);
    if (env === 'development') {
        return sendErrorDev(error, res);
    }
    let objErr = Object.assign({}, error);
    if (objErr.name === 'CastError') {
        objErr = new apiError_1.apiError(`invalid mongoId value ${objErr.value}`, 400);
    }
    ;
    if (objErr.code === 11000) {
        objErr = handleDuplicateError(objErr);
    }
    ;
    if (objErr.name === 'ValidationError') {
        objErr = handleValidationError(objErr);
    }
    ;
    return sendErrorProd(objErr, res);
};
exports.errorHandler = errorHandler;
