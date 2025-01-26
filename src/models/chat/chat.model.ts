import { model, Schema } from "mongoose";


const chatSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    isGroupchat: {
        type: Boolean,
        default: false,
    },
    // lastMessage: {
    //     type: Schema.Types.ObjectId,
    //     ref: "messageModel"
    // },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    admin: {   //their will be admin for group chats only not for one on one chats
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
}, { timestamps: true })

export const chatModel = model("Chat", chatSchema)