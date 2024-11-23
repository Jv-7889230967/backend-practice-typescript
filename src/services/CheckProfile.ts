import { ObjectId } from "mongoose"
import { ProfileType } from "../../types/profile"
import { SocialProfile } from "../models/profile.model"


export class CheckProfile {
    userId: ObjectId;
    constructor(userId: ObjectId) {
        this.userId = userId;
    }
    getProfile = async (): Promise<boolean> => {
        try {
            const profileExist: ProfileType | null = await SocialProfile.findOne({ owner: this.userId });
            if (profileExist) {
                return true;
            }
            return false;
        } catch (error: any) {
            return error;
        }
    }
}