"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
    },
    attachments: {
        type: [String],
        default: [],
    },
    chat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "chatModel",
        index: true,
    }
}, { timestamps: true });
exports.messageModel = (0, mongoose_1.model)("Message", messageSchema);
