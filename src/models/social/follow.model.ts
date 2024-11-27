import mongoose, { Schema } from "mongoose";
import { User } from "../auth/UserModels";

const followSchema = new Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    followeeId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    }
}, {
    timestamps: true,
})

export const SocialFollow =  mongoose.model("SocialFollow",followSchema); 