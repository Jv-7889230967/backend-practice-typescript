import { NextFunction, Request, Response } from "express";
import { UserType } from "../types/user.js";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/UserModels.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError("user Unauthrozed", 401)
    }
    try {
        const userValue = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
        const user: UserType = await User.findById(userValue._id).select("-refreshtoken");
        if (!user) {
            throw new ApiError("Invalid access token", 401)
        }
        req.user = user;
        next();

    } catch (error: any) {
        throw new ApiError(error || "Invalid access token", 401)
    }
})