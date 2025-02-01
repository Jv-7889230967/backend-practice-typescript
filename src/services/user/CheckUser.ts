import mongoose, { ObjectId } from "mongoose";
import { User } from "../../models/auth/UserModels.js";


export class CheckUser {
    userId: mongoose.Types.ObjectId | null;
    constructor(userId: mongoose.Types.ObjectId | null) {
        this.userId = userId;
    }
    async checkUser(): Promise<boolean> {
        const userExists = User.findById(this.userId).select("_id");
        
        if (!userExists) {
            return false;
        }
        return true;
    }
}