import mongoose, { Schema } from "mongoose";


const LikeSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "SocialPost",
        default: null,
        index: true,
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "commentModal",
        default: null
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
})

export const LikeModel = mongoose.model("LikeModel", LikeSchema)