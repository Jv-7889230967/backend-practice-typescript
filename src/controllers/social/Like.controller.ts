import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { LikeModel } from "../../models/social/like.models.js";
import { getUserFromRequest } from "../../utils/AttachUser.js";
import { likeModal } from "../../../types/like.js";


class LikeController {

    likeUnlikePost = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const { postId, commentId } = req.body;
        const currentUser = getUserFromRequest(req);

        const isAlreadyLiked: likeModal | null = await LikeModel.findOne({
            postId: postId,
            commentId: commentId,
            likedBy: currentUser?._id
        })
        if (isAlreadyLiked) {
            await LikeModel.deleteOne({
                likedBy: currentUser?._id
            });
            return res
                .status(200)
                .json({
                    message: "Post is unliked successfully",
                })
        }
        else {
            const likedPostorComment = await LikeModel.create({
                postId: postId,
                commentId: commentId,
                likedBy: currentUser?._id
            });
            return res
                .status(201)
                .json({
                    message: "post liked successfully",
                    likedPostorComment: likedPostorComment
                })
        }
    })

}

export const likeController = new LikeController();