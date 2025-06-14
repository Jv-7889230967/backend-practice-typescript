import mongoose, { Schema } from "mongoose";
import { User } from "../auth/UserModels";

const PostSchema = new Schema({
    content: {
        type: String,
        required: true,
        index: true
    },
    tags: {
        type: [String],
        default: []
    },
    image: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const SocialPost = mongoose.model("SocialPost", PostSchema)