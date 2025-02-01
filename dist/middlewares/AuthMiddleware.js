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
exports.authMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AsyncHandler_1 = require("../utils/AsyncHandler");
const AttachUser_1 = require("../utils/AttachUser");
const UserModels_1 = require("../models/auth/UserModels");
exports.authMiddleware = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
    if (!token) {
        throw new ApiError_1.ApiError("User Unauthorized", 401);
    }
    const access_token_secret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const refresh_token_secret = process.env.JWT_REFRESH_TOKEN_SECRET;
    if (!access_token_secret || !refresh_token_secret) {
        throw new ApiError_1.ApiError("JWT access or refresh token secret is not defined", 401);
    }
    try {
        const userValue = jsonwebtoken_1.default.verify(token, access_token_secret);
        const user = yield UserModels_1.User.findById(userValue._id);
        if (!user) {
            throw new ApiError_1.ApiError("Invalid access token", 401);
        }
        (0, AttachUser_1.attachUserToRequest)(req, user); //Adding the user tot the req object
        next();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === "TokenExpiredError") {
            try {
                const refreshToken = (_c = req === null || req === void 0 ? void 0 : req.cookies) === null || _c === void 0 ? void 0 : _c.refresh_token;
                const userValue = jsonwebtoken_1.default.verify(refreshToken, refresh_token_secret);
                const user = yield UserModels_1.User.findById(userValue._id);
                if (!user) {
                    throw new ApiError_1.ApiError("Invalid access token", 401);
                }
                if (refreshToken === (user === null || user === void 0 ? void 0 : user.refreshtoken)) {
                    const access_token = user === null || user === void 0 ? void 0 : user.generateAccess_token();
                    res.cookie("access_token", access_token, { httpOnly: true, secure: true });
                    (0, AttachUser_1.attachUserToRequest)(req, user);
                    next();
                }
            }
            catch (error) {
                throw new ApiError_1.ApiError((error === null || error === void 0 ? void 0 : error.message) || "failed to login using refresh token", 401);
            }
        }
        else {
            throw new ApiError_1.ApiError(error.message || "Invalid access token", 401);
        }
    }
}));
