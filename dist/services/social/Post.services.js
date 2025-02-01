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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServcies = void 0;
const UserModels_1 = require("../../models/auth/UserModels");
const ApiError_1 = require("../../utils/ApiError");
class PostServcies {
    constructor() {
        this.getPostbyUsername = (username_1, ...args_1) => __awaiter(this, [username_1, ...args_1], void 0, function* (username, page = 1, limit = 10) {
            try {
                const skip = (page - 1) * limit;
                const userPosts = yield UserModels_1.User.aggregate([
                    {
                        $match: {
                            username: username,
                        }
                    },
                    {
                        $lookup: {
                            from: "socialposts",
                            localField: "_id",
                            foreignField: "author",
                            as: "posts",
                            pipeline: [
                                {
                                    $lookup: {
                                        from: "likemodels",
                                        localField: "_id",
                                        foreignField: "postId",
                                        as: "postlikes",
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "commentmodals",
                                        localField: "_id",
                                        foreignField: "postId",
                                        as: "comments",
                                        pipeline: [
                                            {
                                                $lookup: {
                                                    from: "commentmodals",
                                                    localField: "_id",
                                                    foreignField: "commentId",
                                                    as: "commentreplies",
                                                    pipeline: [
                                                        {
                                                            $group: {
                                                                _id: "$commentId",
                                                                replyCount: { $sum: 1 }
                                                            }
                                                        },
                                                        {
                                                            $project: {
                                                                _id: 0,
                                                                replyCount: 1
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                $lookup: {
                                                    from: "likemodels",
                                                    localField: "_id",
                                                    foreignField: "commentId",
                                                    as: "commentlikes",
                                                }
                                            },
                                            {
                                                $project: {
                                                    _id: 0,
                                                    content: 1,
                                                    author: 1,
                                                    replies: { $arrayElemAt: ["$commentreplies.replyCount", 0] },
                                                    commentLikes: { $size: "$commentlikes" },
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        content: 1,
                                        image: 1,
                                        tags: 1,
                                        author: 1,
                                        postLikes: { $size: "$postlikes" },
                                        comments: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            posts: {
                                $ifNull: ["$posts", "No posts available"]
                            }
                        }
                    },
                    {
                        $unwind: {
                            path: "$posts",
                        }
                    },
                    {
                        $project: {
                            posts: 1,
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: "$posts",
                        }
                    },
                    {
                        $skip: skip !== null && skip !== void 0 ? skip : 0,
                    },
                    {
                        $limit: limit !== null && limit !== void 0 ? limit : 10,
                    }
                ]);
                return userPosts;
            }
            catch (error) {
                throw new ApiError_1.ApiError((error === null || error === void 0 ? void 0 : error.message) || "error fetchcng posts", 500);
            }
        });
    }
}
exports.PostServcies = PostServcies;
