import mongoose, { Schema } from "mongoose";
import { userRoleEnum } from "../constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



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
    const accessTokenSecret = "jatinverma";
    if (!accessTokenSecret) {
        throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined');
    }

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
    },
    accessTokenSecret,
    {
        expiresIn: '1d'
    });
}

userSchema.methods.generateRefresh_token = function () {   // method to generate refresh token using jwt
    const refreshTokenSecret = "jatinverma";
    if (!refreshTokenSecret) {
        throw new Error('JWT_REFRESH_TOKEN_SECRET is not defined');
    }

    return jwt.sign({
        _id: this._id
    },
    refreshTokenSecret,
    {
        expiresIn: '1d'
    });
}

export const User = mongoose.model("User", userSchema);
