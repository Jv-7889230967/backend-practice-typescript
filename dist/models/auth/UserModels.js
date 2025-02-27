"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../../constants");
const ApiError_1 = require("../../utils/ApiError");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    phonenumber: {
        type: Number,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "password is mandatory"],
        select: false
    },
    useravatar: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: 'https://via.placeholder.com/200x200.png',
            localPath: ''
        }
    },
    role: {
        type: String,
        enum: Object.values(constants_1.userRoleEnum),
        default: constants_1.userRoleEnum.USER,
        required: true
    },
    refreshtoken: {
        type: String,
    }
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcrypt_1.default.hash(this.password, 10);
        }
        next();
    });
});
userSchema.methods.isPasswordCorrect = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
userSchema.methods.generateAccess_token = function () {
    const access_token_secret = process.env.JWT_ACCESS_TOKEN_SECRET;
    if (!access_token_secret) {
        throw new ApiError_1.ApiError("access token is undefined", 401);
    }
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
    }, access_token_secret, {
        expiresIn: '1d'
    });
};
userSchema.methods.generateRefresh_token = function () {
    const refresh_token_secret = process.env.JWT_REFRESH_TOKEN_SECRET;
    if (!refresh_token_secret) {
        throw new ApiError_1.ApiError("refresh token is not defined", 401);
    }
    return jsonwebtoken_1.default.sign({
        _id: this._id
    }, refresh_token_secret, {
        expiresIn: '5d'
    });
};
exports.User = mongoose_1.default.model("User", userSchema);
