// src/utils/authHelpers.ts
import { Request } from "express";
import { UserType } from "../../types/user.js";

// Attach a user to the request object
export const attachUserToRequest = (req: Request, user: UserType): void => {
    // @ts-ignore
    req.user = user;
};

// Retrieve the user from the request object
export const getUserFromRequest = (req: Request): UserType => {
    // @ts-ignore
    return req.user;
};
