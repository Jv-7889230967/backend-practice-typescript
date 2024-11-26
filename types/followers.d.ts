import { ObjectId } from "mongoose";

export interface followerParams {
    tobeFollowedUser: ObjectId;
}