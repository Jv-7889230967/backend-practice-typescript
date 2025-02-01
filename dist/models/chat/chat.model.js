"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    isGroupchat: {
        type: Boolean,
        default: false,
    },
    // lastMessage: {
    //     type: Schema.Types.ObjectId,
    //     ref: "messageModel"
    // },
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
}, { timestamps: true });
exports.chatModel = (0, mongoose_1.model)("Chat", chatSchema);
