"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;
        // Ensure the error stack trace includes the class name for debugging
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
