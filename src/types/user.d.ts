import { Document, ObjectId } from "mongoose";

export interface UserType extends Document {
    _id:ObjectId;
    username: string;
    email: string;
    phonenumber: number;
    password: string;
    useravatar: {
        url: string;
        localPath: string;
    };
    role: string;
    refreshtoken?: string; //can be null or undefined until user login or register
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccess_token(): string;
    generateRefresh_token(): string;
}
