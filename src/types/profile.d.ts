import { Document } from "mongoose";
import { User } from "../models/userModels";


export interface socialProfileType extends Document {
    coverImage: {
        url: string,
        localPath: string,
    },
    firstName: string,
    lastName: string,
    bio: string,
    DOB:Date,
    location:string,
    conutryCode:string,
    owner:typeof User,
}