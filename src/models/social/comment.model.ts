import mongoose, { Schema } from "mongoose";
import { User } from "../auth/UserModels";
import { SocialPost } from "./post.model";


const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "SocialPost",
        default: null,
        index: true,
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "commentModal",
        default: null,
        index: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const commentModal = mongoose.model("commentModal", CommentSchema)