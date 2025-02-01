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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialProfile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userProfile = new mongoose_1.Schema({
    coverImage: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: 'https://via.placeholder.com/200x200.png',
            localPath: ''
        }
    },
    firstName: {
        type: String,
        default: "jatin"
    },
    lastName: {
        type: String,
        default: "verma"
    },
    bio: {
        type: String,
        default: "",
    },
    DOB: {
        type: Date,
        default: null,
    },
    location: {
        type: String,
        default: "",
    },
    countryCode: {
        type: String,
        default: "",
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
});
exports.SocialProfile = mongoose_1.default.model("SocialProfile", userProfile);
