import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRoleEnum } from "../../constants";
import { ApiError } from "../../utils/ApiError";




const userSchema = new Schema({   //schema format for userDetails
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    phonenumber: {
        type: Number,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "password is mandatory"],
        select: false
    },
    useravatar: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: 'https://via.placeholder.com/200x200.png',
            localPath: ''
        }
    },
    role: {
        type: String,
        enum: Object.values(userRoleEnum),
        default: userRoleEnum.USER,
        required: true
    },
    refreshtoken: {
        type: String,
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {  // method to check before saving the password that if password is changes then hash it
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function (password: string) {  //password comparator
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccess_token = function () {   // method to generate the access token using jwt
    const access_token_secret: string | undefined = process.env.JWT_ACCESS_TOKEN_SECRET;
    if (!access_token_secret) {
        throw new ApiError("access token is undefined", 401);
    }
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
    },
        access_token_secret,
        {
            expiresIn: '1d'
        });
}

userSchema.methods.generateRefresh_token = function () {   // method to generate refresh token using jwt
    const refresh_token_secret: string | undefined = process.env.JWT_REFRESH_TOKEN_SECRET;
    if (!refresh_token_secret) {
        throw new ApiError("refresh token is not defined", 401);
    }
    return jwt.sign({
        _id: this._id
    },
        refresh_token_secret,
        {
            expiresIn: '5d'
        });
}

export const User = mongoose.model("User", userSchema);
