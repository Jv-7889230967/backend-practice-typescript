import mongoose, { ObjectId } from "mongoose"
import { ProfileType } from "../../../types/profile";
import { ApiError } from "../../utils/ApiError";
import { SocialProfile } from "../../models/social/profile.model";
import { SocialFollow } from "../../models/social/follow.model";



export class CheckProfile {
    userId: mongoose.Types.ObjectId | null;
    constructor(userId: mongoose.Types.ObjectId | null) {
        this.userId = userId;
    }
    getProfile = async (): Promise<ProfileType | null> => {
        try {
            const profile: ProfileType | null = await SocialProfile.findOne({ owner: this.userId });
            return profile;
        } catch (error: any) {
            throw new ApiError(error ?? "use not found", 404);
        }
    }
    checkProfile = async (): Promise<boolean> => {
        try {
            const profileExist: ProfileType | null = await SocialProfile.findOne({ owner: this.userId }).select("_id");
            if (profileExist) {
                return true;
            }
            return false;
        } catch (error: any) {
            return error;
        }
    }
    followCheck = async (): Promise<boolean> => {
        try {
            const profileExist = await this.checkProfile();
            if (!profileExist) {
                throw new ApiError("profile does not exist", 404);
            }
            const isFollowing: ProfileType | null = await SocialFollow.findOne({ followerId: this.userId }).select("_id");
            if (!isFollowing) {
                return false;
            }
            return true;
        } catch (error: any) {
            throw new ApiError(error?.message, error.status);
        }
    }

}