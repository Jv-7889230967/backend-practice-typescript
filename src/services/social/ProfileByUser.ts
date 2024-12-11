import mongoose from "mongoose";
import { UserType } from "../../../types/user";
import { User } from "../../models/auth/UserModels";
import { SocialFollow } from "../../models/social/follow.model";
import { ApiError } from "../../utils/ApiError";


interface userProfile {
    profile: {
        coverImage: {
            url: string,
            localPath: string,
        },
        firstName: string,
        lastName: string,
        bio: string,
        location: string,
        countryCode: string
    },
    userData: {
        id: mongoose.Types.ObjectId,
        username: string,
        email: string
    }
}
interface followerList {
    profile: [
        {
            Bio: string,
            Location: string,
            CoverImage: {
                url: string,
                localPath: string,
            }
        }
    ],
    username: string,
    email: string
}


export class GetProfileByUser {
    fieldName: string;
    userField: keyof UserType;    //in ths service the profile can be fetched using any user field by matching that field in the User collection 

    constructor(fieldName: string, userField: keyof UserType) {
        this.userField = userField;
        this.fieldName = fieldName;
    }

    getProfilebyUser = async (): Promise<userProfile> => {
        try {
            const matchStage = {
                $match: {
                    [this.fieldName]: this.userField.toLowerCase(), // Dynamic key for matchinng the User document
                },
            };
            const userProfile = await User.aggregate([
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
                            $ifNull: [  //returning default if the profile document was not found for this user
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
                    $project: {  //finally returning the combined data from users and social profiles
                        _id: 0,
                        userData: 1,
                        profile: 1,
                    },
                },
            ]);

            if (!userProfile || userProfile.length === 0) {
                throw new ApiError("User profile not found", 404);
            }
            return userProfile[0];
        } catch (error: any) {
            return error
        }
    }

    getFollowers = async (currentUser: UserType): Promise<followerList[] | string> => {
        try {

            const userProfile: userProfile = await this.getProfilebyUser();
            const isFollowing = await this.CheckifFollower(currentUser?.username, this.userField);
            // if (!isFollowing?.followerDetails) {
            //     return "User not following this user"
            // }

            const followersList = await SocialFollow.aggregate([
                {
                    $match: {
                        followeeId: new mongoose.Types.ObjectId(userProfile?.userData?.id),
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
                                    "profile": { $ne: [] }    //checking for empty profile are not included in results
                                }
                            },
                            {
                                $lookup: {     //checking if curret loggedin user follows the looked up user or not
                                    from: "socialfollows",
                                    localField: "_id",
                                    foreignField: "followerId",
                                    as: "isFollowing",
                                    pipeline: [
                                        {
                                            $match: {
                                                followerId: currentUser?._id,
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $unwind: {    //unwinding the returned profile array for further processing 
                                    path: "$profile",
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $addFields: {     //adding the profile document fields response
                                    Bio: "$profile.bio",
                                    Location: "$profile.location",
                                    CoverImage: "$profile.coverImage",
                                    isFollowing: {
                                        $cond: {   //while adding the field adding the $cond operator to check if the returned document size is gte 1 and return just boolean value instead of whole document
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
                                $project: {  //projecting only necessary fields from all the documents
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
        } catch (error: any) {
            return error;
        }
    };

    CheckifFollower = async (userName1: string, userName2: string): Promise<{ followerDetails: boolean }> => {

        const isFollowing = await User.aggregate([
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

        ])

        return isFollowing[0];
    }

}
