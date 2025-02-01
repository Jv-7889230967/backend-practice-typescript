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
exports.FollowersService = void 0;
const follow_model_1 = require("../../models/social/follow.model");
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const AttachUser_1 = require("../../utils/AttachUser");
const UserModels_1 = require("../../models/auth/UserModels");
const ApiError_1 = require("../../utils/ApiError");
const CheckProfile_1 = require("../../services/social/CheckProfile");
const ProfileByUser_1 = require("../../services/social/ProfileByUser");
class Followers extends CheckProfile_1.CheckProfile {
    constructor(followModel) {
        super(null);
        this.followUser = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const tobeFollowedUser = req.params; //getting the user i want to follow from params
            if (!tobeFollowedUser) {
                throw new ApiError_1.ApiError("followee id is required", 400);
            }
            const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
            if (!currentUser) {
                throw new ApiError_1.ApiError("please login as user is not attached to req object", 409);
            }
            const getCurrentUser = new CheckProfile_1.CheckProfile(currentUser === null || currentUser === void 0 ? void 0 : currentUser._id);
            const profileExists = yield getCurrentUser.checkProfile();
            if (!profileExists) {
                throw new ApiError_1.ApiError("Please create a Social profile to follow a user", 404);
            }
            const tobeFollowedExists = yield UserModels_1.User.findById(tobeFollowedUser.tobeFollowedId); //checing if tobeFollowed user exists or not
            if (!tobeFollowedExists) {
                throw new ApiError_1.ApiError("user you want to follow does not exist", 404);
            }
            const alreadyFollowing = yield this.followModel.findOne({
                followerId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id,
                followeeId: tobeFollowedUser.tobeFollowedId,
            });
            if (alreadyFollowing) {
                throw new ApiError_1.ApiError("you are already following this user", 409);
            }
            const followUser = yield this.followModel.create({
                followerId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id,
                followeeId: tobeFollowedUser.tobeFollowedId,
            });
            const followDetails = yield followUser.populate("followerId");
            return res
                .status(201)
                .json({
                message: "you have successfully followed the user",
                FollowerandFolloweeDetails: followDetails
            });
        }));
        this.UnFollowuser = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const tobeUnfollowedUser = req.params; //getting the user id whome user want to unfollowx
            if (!tobeUnfollowedUser) {
                throw new ApiError_1.ApiError("The ID of the user to unfollow is required", 400);
            }
            const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
            if (!currentUser) {
                throw new ApiError_1.ApiError("please login as user is not attached to req object", 409);
            }
            const checkProfile = new CheckProfile_1.CheckProfile(currentUser.id); //instantiating the checkprofile class 
            const isFollowing = yield checkProfile.followCheck();
            // accessing the followcheck method of the check profile class to check before unfloowingthe user that use is following the user or not
            if (!isFollowing) {
                throw new ApiError_1.ApiError("You are not following this user", 409);
            }
            const unFollowedUser = yield this.followModel.findOneAndDelete({
                followerId: currentUser._id,
                followeeId: tobeUnfollowedUser.tobeUnFollowedId,
            }).populate("followeeId").select("-_id followeeId"); //unfollowing the user and getting the unfollowed user detail
            if (!unFollowedUser) {
                throw new ApiError_1.ApiError("Error occurred while unfollowing the user", 409);
            }
            return res
                .status(200)
                .json({
                message: "you have successfully unfollowed user",
                unFollowedUser: unFollowedUser
            });
        }));
        this.getFollowersByUserName = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName } = req.body;
                if (!userName) {
                    throw new ApiError_1.ApiError("user field is required", 400);
                }
                const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
                const profileByuser = new ProfileByUser_1.GetProfileByUser("username", userName);
                const followers = yield profileByuser.getFollowers(currentUser);
                console.log(followers);
                return res.
                    status(200)
                    .json({
                    message: "profile details feched successfully",
                    FollowersList: followers.length > 0 ? followers : "Nobody follows this user",
                });
            }
            catch (error) {
                throw new ApiError_1.ApiError(error === null || error === void 0 ? void 0 : error.message, error === null || error === void 0 ? void 0 : error.code);
            }
        }));
        this.followModel = followModel;
    }
}
exports.FollowersService = new Followers(follow_model_1.SocialFollow);
