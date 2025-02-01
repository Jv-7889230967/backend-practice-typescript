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
exports.GetProfileByUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserModels_1 = require("../../models/auth/UserModels");
const follow_model_1 = require("../../models/social/follow.model");
const ApiError_1 = require("../../utils/ApiError");
class GetProfileByUser {
    constructor(fieldName, userField) {
        this.getProfilebyUser = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const matchStage = {
                    $match: {
                        [this.fieldName]: this.userField.toLowerCase(), // Dynamic key for matchinng the User document
                    },
                };
                const userProfile = yield UserModels_1.User.aggregate([
                    matchStage,
                    {
                        $lookup: {
                            from: "socialprofiles",
                            localField: "_id",
                            foreignField: "owner",
                            as: "profile",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 0,
                                        firstName: 1,
                                        lastName: 1,
                                        bio: 1,
                                        location: 1,
                                        countryCode: 1,
                                        coverImage: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            profile: {
                                $ifNull: [
                                    {
                                        $first: "$profile"
                                    },
                                    {
                                        message: "Associated profile not found"
                                    }
                                ]
                            },
                            userData: {
                                id: `$_id`,
                                username: `$username`,
                                email: `$email`,
                            }
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            userData: 1,
                            profile: 1,
                        },
                    },
                ]);
                if (!userProfile || userProfile.length === 0) {
                    throw new ApiError_1.ApiError("User profile not found", 404);
                }
                return userProfile[0];
            }
            catch (error) {
                return error;
            }
        });
        this.getFollowers = (currentUser) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userProfile = yield this.getProfilebyUser();
                const isFollowing = yield this.CheckifFollower(currentUser === null || currentUser === void 0 ? void 0 : currentUser.username, this.userField);
                // if (!isFollowing?.followerDetails) {
                //     return "User not following this user"
                // }
                const followersList = yield follow_model_1.SocialFollow.aggregate([
                    {
                        $match: {
                            followeeId: new mongoose_1.default.Types.ObjectId((_a = userProfile === null || userProfile === void 0 ? void 0 : userProfile.userData) === null || _a === void 0 ? void 0 : _a.id),
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "followerId",
                            foreignField: "_id",
                            as: "follower",
                            pipeline: [
                                {
                                    $lookup: {
                                        from: "socialprofiles",
                                        localField: "_id",
                                        foreignField: "owner",
                                        as: "profile",
                                    },
                                },
                                {
                                    $match: {
                                        "profile": { $ne: [] } //checking for empty profile are not included in results
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "socialfollows",
                                        localField: "_id",
                                        foreignField: "followerId",
                                        as: "isFollowing",
                                        pipeline: [
                                            {
                                                $match: {
                                                    followerId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id,
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$profile",
                                        preserveNullAndEmptyArrays: true
                                    }
                                },
                                {
                                    $addFields: {
                                        Bio: "$profile.bio",
                                        Location: "$profile.location",
                                        CoverImage: "$profile.coverImage",
                                        isFollowing: {
                                            $cond: {
                                                if: {
                                                    $gte: [
                                                        {
                                                            $size: "$isFollowing"
                                                        },
                                                        1
                                                    ],
                                                },
                                                then: true,
                                                else: false,
                                            }
                                        }
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        isFollowing: 1,
                                        UserName: "$username",
                                        Email: "$email",
                                        Bio: 1,
                                        Location: 1,
                                        CoverImage: 1,
                                    },
                                },
                            ]
                        },
                    },
                    {
                        $unwind: {
                            path: "$follower",
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: "$follower",
                        },
                    }
                ]);
                return followersList;
            }
            catch (error) {
                return error;
            }
        });
        this.CheckifFollower = (userName1, userName2) => __awaiter(this, void 0, void 0, function* () {
            const isFollowing = yield UserModels_1.User.aggregate([
                {
                    $match: {
                        username: userName2,
                    }
                },
                {
                    $lookup: {
                        from: "socialfollows",
                        localField: "_id",
                        foreignField: "followeeId",
                        as: "isFollowing",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "followerId",
                                    foreignField: "_id",
                                    as: "followerDetails",
                                }
                            },
                            {
                                $match: {
                                    "followerDetails.username": userName1
                                }
                            },
                            {
                                $addFields: {
                                    followerDetails: {
                                        $cond: {
                                            if: {
                                                $gte: [
                                                    {
                                                        $size: "$followerDetails"
                                                    },
                                                    1
                                                ]
                                            },
                                            then: true,
                                            else: false,
                                        }
                                    }
                                }
                            },
                            {
                                $unwind: {
                                    path: "$followerDetails",
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    followerDetails: 1,
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: "$isFollowing"
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$isFollowing"
                    }
                }
            ]);
            return isFollowing[0];
        });
        this.userField = userField;
        this.fieldName = fieldName;
    }
}
exports.GetProfileByUser = GetProfileByUser;
