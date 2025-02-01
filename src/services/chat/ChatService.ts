import mongoose from "mongoose";
import { chatModel } from "../../models/chat/chat.model";

export class chatService {

    getPreviousChat = async (participants: string[], page: number, limit: number) => {
        let offset: number = (page - 1) * limit;

        const defaultOffset: number = 0;
        const defaultLimit: number = 10;

        const perviousChat = await chatModel.aggregate([
            {
                $match: {
                    isGroupchat: false,
                    participants: {
                        $all: participants.map(id => new mongoose.Types.ObjectId(id)),
                    },
                    $expr: { $eq: [{ $size: "$participants" }, participants.length] },
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
                                _id: 0,
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
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "chat",
                    as: "messages",
                    pipeline: [
                        {
                            $facet: {  // using facet operator for running multiple operation ina single stage for getting messages and total count
                                messages: [
                                    { $skip: offset || defaultOffset },
                                    { $limit: limit || defaultLimit },
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "sender",
                                            foreignField: "_id",
                                            as: "senderDetails",
                                        },
                                    },
                                    { $unwind: { path: "$senderDetails" } },
                                    {
                                        $addFields: {
                                            senderDetails: {
                                                $cond: {
                                                    if: { $eq: ["$senderDetails", {}] },
                                                    then: { message: "sender details not found" },
                                                    else: {
                                                        username: "$senderDetails.username",
                                                        email: "$senderDetails.email",
                                                    }
                                                }
                                            },
                                            messages: {
                                                content: "$content",
                                                attachments: "$attachments",
                                                messagedAt: {
                                                    $dateToString: {
                                                        format: "%Y-%m-%d %H:%M:%S",
                                                        date: "$createdAt"
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            messages: 1,
                                            senderDetails: 1,
                                        }
                                    }
                                ],
                                totalCount: [  //getting total count of the messages available in DB
                                    { $count: "totalMessages" }
                                ],
                            }
                        },
                        {
                            $unwind: { path: "$totalCount" }
                        }
                    ]
                }
            },
            {
                $unwind: { path: "$messages" }  // Unwind the messages array
            },
            {
                $addFields: {
                    pagination: {
                        totalMessages: "$messages.totalCount.totalMessages",
                        currentPage: page || 1,
                        limit: limit || defaultLimit,
                        nextPage: {
                            $cond: {
                                if: { $eq: ["$messages.totalCount.totalMessages", page] },
                                then: "Next page not available",
                                else: page + 1 || 2,
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    isGroupchat: 1,
                    admin: 1,
                    participantProfile: 1,
                    messages: "$messages.messages",  // Get paginated messages
                    pagination: 1,
                }
            },
        ]);

        return perviousChat;
    }
}
