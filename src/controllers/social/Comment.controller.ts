import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { getUserFromRequest } from "../../utils/AttachUser";
import { commentModal } from "../../models/social/comment.model";
import { commentType } from "../../../types/comment";
import { ApiError } from "../../utils/ApiError";
import { CommentServices } from "../../services/social/comment.services";



class CommentController extends CommentServices {

    PostComment = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { content, postId, commentId } = req.body;
            const currentUser = getUserFromRequest(req);

            const addedComment: commentType | null = await commentModal.create({
                content: content,
                postId: postId,
                commentId: commentId,
                author: currentUser._id,
            })
            return res
                .status(201)
                .json({
                    message: "your comment is been Added",
                    comment: addedComment
                })
        } catch (error: any) {
            throw new ApiError(error?.message || "Error adding comment", 500);
        }
    })

    DeleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { commentId } = req.body;

            await commentModal.findByIdAndDelete({ _id: commentId });

            return res
                .status(200)
                .json({
                    message: "comment deleted successfully"
                })
        } catch (error: any) {
            throw new ApiError(error?.message || "Error deleting the comment", 500);
        }
    })

    UpdateComment = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const { commentId, content } = req.body;

        if (!commentId || !content) {
            throw new ApiError("please fill all required field", 400);
        }
        const updatedComment = await commentModal.findByIdAndUpdate(
            commentId,
            { content },
            { new: true, runValidators: true }
        ).select("-_id -createdAt -updatedAt");

        if (!updatedComment) {
            throw new ApiError("Comment not found", 404);
        }
        return res
            .status(200)
            .json({
                message: "your post updated successfully",
                updatedComment: updatedComment
            })
    })

    getCommentReplies = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { commentId, page, limit } = req.body;
            const getCommentReplies = new CommentServices();
            const replies = await getCommentReplies.getReplies(commentId, page, limit);

            return res
                .status(200)
                .json({
                    message: "comment repllies fetched successfully",
                    commentReplies: replies
                })
        } catch (error: any) {
            throw new ApiError(error?.message, 500)
        }
    })
}

export const commentController = new CommentController();