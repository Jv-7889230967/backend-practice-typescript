import { model, Schema } from "mongoose";


const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
    },
    attachments: {
        type: [
            {
                url: String,
                localPath: String,
            }
        ],
        default: [],
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "chatModel"
    }
}, { timestamps: true })

export const messageModel = model("Message", messageSchema)