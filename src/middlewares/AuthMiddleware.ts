import { NextFunction, Request, Response } from "express";
import { UserType } from "../../types/user";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler";
import { User } from "../models/UserModels";
import { attachUserToRequest } from "../utils/AttachUser";
import { configDotenv } from "dotenv";
configDotenv();

export const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError("User Unauthorized", 401);
    }

    const access_token_secret:string | undefined = process.env.JWT_ACCESS_TOKEN_SECRET;
    // console.log("secret",secret);
    if (!access_token_secret) {
        throw new ApiError("JWT access token secret is not defined", 401);
    }

    try {
        const userValue = jwt.verify(token, access_token_secret) as JwtPayload;
        const user: UserType | null = await User.findById(userValue._id).select("-refreshtoken");
        if (!user) {
            throw new ApiError("Invalid access token", 401);
        }

        attachUserToRequest(req, user);  //Adding the user tot the req object

        next();
    } catch (error: any) {
        throw new ApiError(error.message || "Invalid access token", 401);
    }
});
