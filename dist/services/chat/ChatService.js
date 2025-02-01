"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chat_model_1 = require("../../models/chat/chat.model");
class chatService {
    constructor() {
        this.getPreviousChat = (participants, page, limit) => __awaiter(this, void 0, void 0, function* () {
            let offset = (page - 1) * limit;
            const defaultOffset = 0;
            const defaultLimit = 10;
            const perviousChat = yield chat_model_1.chatModel.aggregate([
                {
                    $match: {
                        isGroupchat: false,
                        participants: {
                            $all: participants.map(id => new mongoose_1.default.Types.ObjectId(id)),
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
                                $facet: {
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
                                    totalCount: [
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
                    $unwind: { path: "$messages" } // Unwind the messages array
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
                        messages: "$messages.messages", // Get paginated messages
                        pagination: 1,
                    }
                },
            ]);
            return perviousChat;
        });
    }
}
exports.chatService = chatService;
