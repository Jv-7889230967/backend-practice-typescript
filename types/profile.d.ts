import { Document } from "mongoose"
import { UserType } from "./user"

export interface ProfileType extends Document {
    coverImage: {
        url: string | undefined,
        localPath: string | undefined
    },
    firstName: string,
    lastName: string,
    bio: string,
    DOB: Date | null,
    location: string,
    countryCode: string,
    owner: mongoose.Types.ObjectId,
}

interface Profile {
    firstName: string,
    lastName: string,
    bio: string,
    location: string,
    countryCode: string,
    coverImage: {
        url: String,
        localPath: String
    },
}

export interface ProfilebyUser {
    username: string,
    email: string,
    avatar: {
        url: String,
        localPath: String
    },
    profile: Profile | null,

}