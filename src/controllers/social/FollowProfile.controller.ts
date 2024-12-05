import { NextFunction, Request, Response } from "express";
import { SocialFollow } from "../../models/social/follow.model";
import { asyncHandler } from "../../utils/AsyncHandler";
import { getUserFromRequest } from "../../utils/AttachUser";
import { User } from "../../models/auth/UserModels";
import { ApiError } from "../../utils/ApiError";
import { UserType } from "../../../types/user";
import { CheckUser } from "../../services/user/CheckUser";
import { CheckProfile } from "../../services/social/CheckProfile";
import { GetProfileByUser } from "../../services/social/ProfileByUser";

class Followers extends CheckUser {
    followModel: typeof SocialFollow;
    constructor(followModel: typeof SocialFollow) {
        super(null);
        this.followModel = followModel;
    }

    followUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const tobeFollowedUser = req.params;  //getting the user i want to follow from params

        if (!tobeFollowedUser) {
            throw new ApiError("followee id is required", 400);
        }
        const currentUser: UserType | undefined = getUserFromRequest(req);
        if (!currentUser) {
            throw new ApiError("please login as user is not attached to req object", 409);
        }
        const getCurrentUser = new CheckUser(currentUser?._id);
        const userExists = await getCurrentUser.checkUser();

        if (!userExists) {  //checking if user who want's to follow exists or not 
            throw new ApiError("logged-in user not found", 404);
        }

        const tobeFollowedExists = await User.findById(tobeFollowedUser.tobeFollowedId); //checing if tobeFollowed user exists or not
        if (!tobeFollowedExists) {
            throw new ApiError("user you want to follow does not exist", 404);
        }

        const alreadyFollowing = await this.followModel.findOne({
            followerId: currentUser?._id,
            followeeId: tobeFollowedUser.tobeFollowedId,
        })
        if (alreadyFollowing) {
            throw new ApiError("you are already following this user", 409);
        }

        const followUser: InstanceType<typeof this.followModel> = await this.followModel.create({
            followerId: currentUser?._id,
            followeeId: tobeFollowedUser.tobeFollowedId,
        })

        const followDetails = await followUser.populate("followerId");
        return res
            .status(201)
            .json({
                message: "you have successfully followed the user",
                FollowerandFolloweeDetails: followDetails
            })
    })


    UnFollowuser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const tobeUnfollowedUser = req.params; //getting the user id whome user want to unfollowx
        if (!tobeUnfollowedUser) {
            throw new ApiError("The ID of the user to unfollow is required", 400);
        }

        const currentUser: UserType | undefined = getUserFromRequest(req);
        if (!currentUser) {
            throw new ApiError("please login as user is not attached to req object", 409);
        }
        const checkProfile = new CheckProfile(currentUser.id);  //instantiating the checkprofile class 

        const isFollowing: boolean = await checkProfile.followCheck();
        // accessing the followcheck method of the check profile class to check before unfloowingthe user that use is following the user or not

        if (!isFollowing) {
            throw new ApiError("You are not following this user", 409);
        }

        const unFollowedUser = await this.followModel.findOneAndDelete({
            followerId: currentUser._id,
            followeeId: tobeUnfollowedUser.tobeUnFollowedId,
        }).populate("followeeId").select("-_id followeeId"); //unfollowing the user and getting the unfollowed user detail

        if (!unFollowedUser) {
            throw new ApiError("Error occurred while unfollowing the user", 409);
        }
        return res
            .status(200)
            .json({
                message: "you have successfully unfollowed user",
                unFollowedUser: unFollowedUser
            })
    })

    getFollowersByUserName = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { userName } = req.body;
            if (!userName) {
                throw new ApiError("user field is required", 400);
            }

            const profileByuser = new GetProfileByUser("username", userName as keyof UserType);
            const profile = await profileByuser.getFollowers();


            if (!profile) {
                throw new ApiError("profile not found", 404);
            }
            return res.
                status(200)
                .json({
                    message: "profile details feched successfully",
                    User_Data: profile
                })
        } catch (error: any) {
            throw new ApiError(error?.message, error?.code);
        }
    })
}

export const FollowersService = new Followers(SocialFollow);