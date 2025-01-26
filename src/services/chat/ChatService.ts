import mongoose from "mongoose";
import { chatModel } from "../../models/chat/chat.model";

export class chatService {

    getPreviousChat = async (participants: string[]) => {
        const perviousChat = await chatModel.aggregate([
            {
                $match: {
                    isGroupchat: false,
                    participants: {
                        $all: participants.map(id => new mongoose.Types.ObjectId(id)), // Ensure all ObjectIds exist
                    },
                    $expr: { $eq: [{ $size: "$participants" }, participants.length] }, // Ensure exact match
                },

            },
            {
                $lookup: {
                    from: "socialprofiles",
                    localField: "participants",
                    foreignField: "owner",
                    as: "participantProfile",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "userDetails",
                            },
                        },
                        {
                            $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true }
                        },
                        {
                            $addFields: {
                                profile: {
                                    coverImage: "$coverImage.url",
                                    firstName: "$firstName",
                                    lastName: "$lastName",
                                }
                            }
                        },
                        {
                            $project: {
                                _id:0,
                                profile: 1,
                                "userDetails.username": 1,
                                "userDetails.email": 1,
                            }
                        }
                    ],
                },
            },
            {
                $addFields: {
                    participantProfile: {
                        $cond: {
                            if: { $eq: [{ $size: "$participantProfile" }, 0] },
                            then: { SocialProfile: "no social profile found" },
                            else: "$participantProfile"
                        }
                    }
                }
            },
            // {
            //     $lookup:{
            //         from:""
            //     }
            // }
            // {
            //     $unwind: { path: "$participantProfile", preserveNullAndEmptyArrays: true }
            // },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    isGroupchat: 1,
                    admin: 1,
                    participantProfile: 1,
                }
            }
        ])

        return perviousChat;
    }
}