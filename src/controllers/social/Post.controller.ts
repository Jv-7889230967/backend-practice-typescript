import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import { CloudUpload } from "../../services/social/CloudUpload.js";
import { SocialPost } from "../../models/social/post.model.js";
import { getUserFromRequest } from "../../utils/AttachUser.js";
import { promises as fsPromises } from "fs";
import { PostServcies } from "../../services/social/Post.services.js";

class PostController {
    CreatePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const session = await mongoose.startSession();  //starting a session using mongoose
        const currentUser = getUserFromRequest(req);
        try {
            session.startTransaction();
            const { content, tags } = req.body;

            const file = req.file;

            if (!file || !file.path) {
                throw new ApiError("File is required and must be valid.", 400);
            }
            const imageUrl: string = await CloudUpload(file.path);

            const post = await SocialPost.create({
                content: content,
                tags: tags,
                image: imageUrl,
                author: currentUser?._id
            })
            await session.commitTransaction();
            await fsPromises.unlink(file.path); //deleting the saved file
            return res
                .status(201)
                .json({
                    message: "post created successfully",
                    post: post
                })

        } catch (error: any) {
            await session.abortTransaction();
            throw new ApiError(error?.message, 500);
        } finally {
            session.endSession();
        }
    })
    getSocialPost = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const currentUser = getUserFromRequest(req);
        const { page, limit } = req.body;

        const postServices = new PostServcies();
        const posts = await postServices.getPostbyUsername(currentUser?.username, page, limit);

        return res
            .status(200)
            .json({
                message: "your posts are fetched",
                posts: posts
            })
    })
}
export const postController = new PostController();