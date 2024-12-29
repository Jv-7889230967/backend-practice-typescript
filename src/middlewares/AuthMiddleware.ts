import { NextFunction, Request, Response } from "express";
import { UserType } from "../../types/user";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler";

import { attachUserToRequest } from "../utils/AttachUser";
import { User } from "../models/auth/UserModels";

export const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError("User Unauthorized", 401);
    }

    const access_token_secret: string | undefined = process.env.JWT_ACCESS_TOKEN_SECRET;
    const refresh_token_secret: string | undefined = process.env.JWT_REFRESH_TOKEN_SECRET;

    if (!access_token_secret || !refresh_token_secret) {
        throw new ApiError("JWT access or refresh token secret is not defined", 401);
    }

    try {
        const userValue = jwt.verify(token, access_token_secret) as JwtPayload;
        const user: UserType | null = await User.findById(userValue._id);
        if (!user) {
            throw new ApiError("Invalid access token", 401);
        }

        attachUserToRequest(req, user);  //Adding the user tot the req object

        next();
    } catch (error: any) {
        if (error?.name === "TokenExpiredError") {
            try {
                const refreshToken = req?.cookies?.refresh_token;
                const userValue = jwt.verify(refreshToken, refresh_token_secret) as JwtPayload;
                const user: UserType | null = await User.findById(userValue._id);
                if (!user) {
                    throw new ApiError("Invalid access token", 401);
                }
                if (refreshToken === user?.refreshtoken) {
                    const access_token: string | undefined = user?.generateAccess_token();
                    res.cookie("access_token", access_token, { httpOnly: true, secure: true })
                    console.log("jdnfkjdjfnj")
                    attachUserToRequest(req, user);
                    next();
                }
            } catch (error: any) {
                throw new ApiError(error?.message || "failed to login using refresh token", 401)
            }
        }
        else {
            throw new ApiError(error.message || "Invalid access token", 401);
        }
    }
});
