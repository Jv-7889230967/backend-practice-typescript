import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUser } from "../../../types/jwt";

export const getCurrentUser = (auth_token: string | string[] | undefined): jwtUser | null => {
    try {
        const access_token_secret: string | string[] | undefined = process.env.JWT_ACCESS_TOKEN_SECRET;
        const refresh_token_secret: string | undefined = process.env.JWT_REFRESH_TOKEN_SECRET;

        if (!access_token_secret || !refresh_token_secret) {
            throw new Error("JWT access or refresh token secret is not defined");
        }
        const userValue = jwt.verify(auth_token as string, access_token_secret) as jwtUser
        return userValue;

    } catch (error: any) {
        throw new Error(error?.message)
    }
}