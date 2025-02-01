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
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const chat_model_1 = require("../../models/chat/chat.model");
const ApiError_1 = require("../../utils/ApiError");
const message_model_1 = require("../../models/chat/message.model");
const AttachUser_1 = require("../../utils/AttachUser");
const socket_1 = require("../../socket");
const CloudUpload_1 = require("../../services/social/CloudUpload");
const fs_1 = require("fs");
class MessageController {
    constructor() {
        this.sendMessage = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
                const { chatId } = req.params;
                const { messageBody } = req.body;
                const chatAttachments = req.file;
                const uploadedFileLink = yield (0, CloudUpload_1.CloudUpload)(chatAttachments === null || chatAttachments === void 0 ? void 0 : chatAttachments.path);
                const chatExists = yield chat_model_1.chatModel.findById(chatId);
                if (!chatExists) {
                    throw new ApiError_1.ApiError("chat doesn't exists", 404);
                }
                const attachments = [uploadedFileLink];
                yield message_model_1.messageModel.create({
                    sender: currentUser._id,
                    content: messageBody,
                    attachments: attachments,
                    chat: chatId,
                });
                const completePayload = {
                    messageContent: messageBody,
                    attachments: attachments
                };
                (0, socket_1.emitSocketEvent)(req, chatId, "sendMessage", completePayload);
                if (chatAttachments === null || chatAttachments === void 0 ? void 0 : chatAttachments.path) {
                    yield fs_1.promises.unlink(chatAttachments === null || chatAttachments === void 0 ? void 0 : chatAttachments.path);
                }
                return res.status(200).json({
                    message: `send to chat ${chatId}`,
                    conversation: {
                        message: messageBody,
                        sender: currentUser.username
                    }
                });
            }
            catch (error) {
                throw new ApiError_1.ApiError(error.message, 400);
            }
        }));
    }
}
exports.messageController = new MessageController();
