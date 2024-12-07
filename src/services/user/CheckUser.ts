import { ObjectId } from "mongoose";
import { User } from "../../models/auth/UserModels";


export class CheckUser {
    userId: ObjectId | null;
    constructor(userId: ObjectId | null) {
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