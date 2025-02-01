"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const multer_1 = require("multer");
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json({
            success: err.status,
            message: err.message,
            errors: err.errors,
        });
    }
    else if (err instanceof multer_1.MulterError) {
        res.status(400).json({
            success: false,
            ErrorType: err.code,
            message: `Multer Error Occurred:${err.message}`
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
exports.errorHandler = errorHandler;
