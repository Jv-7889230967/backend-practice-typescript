import mongoose from "mongoose";
import { commentModal } from "../../models/social/comment.model";
import { commentType } from "../../../types/comment";


export class CommentServices {
    getReplies = async (commentId: string, page: number, limit: number): Promise<commentType[]> => {
        const offset: number = (page - 1) * limit;
        const replies = await commentModal.aggregate([
            {
                $match: {
                    commentId: new mongoose.Types.ObjectId(commentId)
                }
            },
            {
                $project: {
                    _id: 0,
                    content: 1,
                    commentId: 1,
                    author: 1,
                }
            },
            {
                $skip: offset ?? 0
            },
            {
                $limit: limit ?? 10
            }
        ])
        return replies;
    }
}