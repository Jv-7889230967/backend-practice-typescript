import mongoose, { Schema } from "mongoose";
import { User } from "../auth/UserModels";

const followSchema = new Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    followeeId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
})

export const SocialFollow =  mongoose.model("SocialFollow",followSchema); 