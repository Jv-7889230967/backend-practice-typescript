import { JwtPayload } from "jsonwebtoken";
import { Schema } from "mongoose";

export interface jwtUser extends JwtPayload {
    _id: Schema.Types.ObjectId,
    email: string,
    username: string,
    role: string | undefined,
}