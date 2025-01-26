import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { CheckUser } from "../../services/user/CheckUser";
import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError";
import { chatModel } from "../../models/chat/chat.model";
import { getUserFromRequest } from "../../utils/AttachUser";
import { chatService } from "../../services/chat/ChatService";

class ChatController {
    private chatService: chatService;  //injected chatService as a dependency

    constructor(chatService: chatService) {
        this.chatService = chatService;
    }

    CreateorGetChat = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            console.log("req object",req.app.get("io"));
            const { receiverId } = req.params;
            const currentUser = getUserFromRequest(req);
            const checkUSer = new CheckUser(new mongoose.Types.ObjectId(receiverId));

            const userExists: Promise<boolean> = checkUSer.checkUser();

            if (!userExists) {
                throw new ApiError("the receiver you want to chat with does not exist", 404);
            }

            const perviousChat = await this.chatService.getPreviousChat([currentUser?._id.toString(), receiverId]);
            if (perviousChat.length > 0) {
                return res.status(200).json({
                    message: "chat retreived successfully",
                    chat: perviousChat,
                })
            }
            else {
                const createdChat = await chatModel.create({
                    name: "one on one chat",
                    isGroupchat: false,
                    participants: [currentUser?._id, new mongoose.Types.ObjectId(receiverId)],
                    admin: null,
                })
                return res.status(201).json({
                    message: "chat created successfully",
                    chat: createdChat,
                })
            }
        } catch (error: any) {
            throw new ApiError(error?.message || "An error while checking user", 404)
        }
    })
}

export const chatController = new ChatController(new chatService());