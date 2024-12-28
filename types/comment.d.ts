import { Document } from "mongoose";


export interface commentType extends Document {
    content: String,
    postId: Schema.Types.ObjectId,
    commentId: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId,
}