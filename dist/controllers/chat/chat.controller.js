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
exports.chatController = void 0;
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const CheckUser_1 = require("../../services/user/CheckUser");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("../../utils/ApiError");
const chat_model_1 = require("../../models/chat/chat.model");
const AttachUser_1 = require("../../utils/AttachUser");
const ChatService_1 = require("../../services/chat/ChatService");
class ChatController {
    constructor(chatService) {
        this.CreateorGetChat = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { receiverId } = req.params;
                const { page, limit } = req.query;
                const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
                const checkUSer = new CheckUser_1.CheckUser(new mongoose_1.default.Types.ObjectId(receiverId));
                const userExists = checkUSer.checkUser();
                if (!userExists) {
                    throw new ApiError_1.ApiError("the receiver you want to chat with does not exist", 404);
                }
                const perviousChat = yield this.chatService.getPreviousChat([currentUser === null || currentUser === void 0 ? void 0 : currentUser._id.toString(), receiverId], Number(page), Number(limit));
                if (perviousChat.length > 0) {
                    return res.status(200).json({
                        message: "chat retreived successfully",
                        chat: perviousChat[0],
                    });
                }
                else {
                    const createdChat = yield chat_model_1.chatModel.create({
                        name: "one on one chat",
                        isGroupchat: false,
                        participants: [currentUser === null || currentUser === void 0 ? void 0 : currentUser._id, new mongoose_1.default.Types.ObjectId(receiverId)],
                        admin: null,
                    });
                    return res.status(201).json({
                        message: "chat created successfully",
                        chat: createdChat,
                    });
                }
            }
            catch (error) {
                throw new ApiError_1.ApiError((error === null || error === void 0 ? void 0 : error.message) || "An error while checking user", 404);
            }
        }));
        this.chatService = chatService;
    }
}
exports.chatController = new ChatController(new ChatService_1.chatService());
