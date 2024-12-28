import { Document } from "mongoose";

export interface likeModal extends Document {
    post: mongoose.Types.ObjectId,
    likedBy: mongoose.Types.ObjectId,
}