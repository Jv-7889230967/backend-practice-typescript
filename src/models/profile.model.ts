import mongoose, { Schema } from "mongoose";
import { User } from "./userModels";

const userProfile = new Schema({
    coverImage: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: 'https://via.placeholder.com/200x200.png',
            localPath: ''
        }
    },
    firstName: {
        type: String,
        default: "jatin"
    },
    lastName: {
        type: String,
        default: "verma"
    },
    bio: {
        type: String,
        default: "",
    },
    DOB: {
        type: Date,
        default: null,
    },
    location: {
        type: String,
        default: "",
    },
    conutryCode: {
        type: String,
        default: "",
    },
    // phoneNumber: {
    //     type: Number,
    // },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})

export const SocialProfile = mongoose.model("SocialProfile", userProfile);