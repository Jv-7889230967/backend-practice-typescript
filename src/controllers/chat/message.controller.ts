import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { chatModel } from "../../models/chat/chat.model";
import { ApiError } from "../../utils/ApiError";
import { messageModel } from "../../models/chat/message.model";
import { getUserFromRequest } from "../../utils/AttachUser";
import { emitSocketEvent } from "../../socket";


class MessageController {

    sendMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const currentUser = getUserFromRequest(req);
            const { chatId } = req.params;
            const { messageBody } = req.body;

            const chatExists = await chatModel.findById(chatId);
            if (!chatExists) {
                throw new ApiError("chat doesn't exists", 404);
            }

            const message = await messageModel.create({
                sender: currentUser._id,
                content: messageBody,
                attachments: [],
                chat: chatId,
            })

            emitSocketEvent(req, chatId, "sendMessage", messageBody);

            return res.status(200).json({
                message: `send to chat ${chatId}`,
                conversation: {
                    message: messageBody,
                    sender: currentUser.username
                }
            })

        } catch (error: any) {
            throw new ApiError(error.message, 400);
        }
    })
}

export const messageController = new MessageController();