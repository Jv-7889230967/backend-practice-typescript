import { ObjectId } from "mongoose"
import { ProfileType } from "../../types/profile"
import { SocialProfile } from "../models/profile.model"
import { ApiError } from "../utils/ApiError";


export class CheckProfile {
    userId: ObjectId;
    constructor(userId: ObjectId) {
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

}