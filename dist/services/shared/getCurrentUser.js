"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getCurrentUser = (auth_token) => {
    try {
        const access_token_secret = process.env.JWT_ACCESS_TOKEN_SECRET;
        const refresh_token_secret = process.env.JWT_REFRESH_TOKEN_SECRET;
        if (!access_token_secret || !refresh_token_secret) {
            throw new Error("JWT access or refresh token secret is not defined");
        }
        const userValue = jsonwebtoken_1.default.verify(auth_token, access_token_secret);
        return userValue;
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
};
exports.getCurrentUser = getCurrentUser;
