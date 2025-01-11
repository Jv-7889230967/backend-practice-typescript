import { User } from "../../models/auth/UserModels"
import { ApiError } from "../../utils/ApiError"


export class PostServcies {
    getPostbyUsername = async (username: string): Promise<any> => {
        try {
            const userPosts = await User.aggregate([
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
                }
            ])
            return userPosts;
        } catch (error: any) {
            throw new ApiError(error?.message || "error fetchcng posts", 500);
        }
    }
}