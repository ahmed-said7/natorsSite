"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiError = void 0;
class apiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.isOperational = true;
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? "failed" : "error";
    }
    ;
}
exports.apiError = apiError;
;
