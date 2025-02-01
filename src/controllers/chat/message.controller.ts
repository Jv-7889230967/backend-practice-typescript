import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { chatModel } from "../../models/chat/chat.model";
import { ApiError } from "../../utils/ApiError";
import { messageModel } from "../../models/chat/message.model";
import { getUserFromRequest } from "../../utils/AttachUser";
import { emitSocketEvent } from "../../socket";
import { CloudUpload } from "../../services/social/CloudUpload";
import { promises as fsPromises } from "fs";


class MessageController {

    sendMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const currentUser = getUserFromRequest(req);
            const { chatId } = req.params;
            const { messageBody } = req.body;
            const chatAttachments = req.file;

            const uploadedFileLink = await CloudUpload(chatAttachments?.path);
            const chatExists = await chatModel.findById(chatId);
            if (!chatExists) {
                throw new ApiError("chat doesn't exists", 404);
            }
            const attachments: string[] = [uploadedFileLink];
            await messageModel.create({
                sender: currentUser._id,
                content: messageBody,
                attachments: attachments,
                chat: chatId,
            })

            const completePayload: { messageContent: string, attachments: string[] } = {
                messageContent: messageBody,
                attachments: attachments
            }

            emitSocketEvent(req, chatId, "sendMessage", completePayload);
            if (chatAttachments?.path) {
                await fsPromises.unlink(chatAttachments?.path);
            }
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