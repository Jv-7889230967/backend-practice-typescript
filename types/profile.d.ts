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