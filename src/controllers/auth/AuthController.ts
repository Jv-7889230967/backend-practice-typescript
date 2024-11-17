import { userRoleEnum } from "../../constants";
// import { ObjectId } from 'mongodb';
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/AsyncHandler";
import { generateOTP } from "../../utils/GenerateOTP";
import { otpStore } from "../../utils/TemporaryStorage";
import { User } from "../../models/UserModels";
import { Request, Response, NextFunction } from "express";
import { UserType } from "../../types/user";
import mongoose from "mongoose";
import { SendMessage } from "../../services/SendMessage";


class UserController extends SendMessage {
    UserModel: typeof User;
    constructor(UserModel: typeof User) {
        super(0, "");  //sending default value for sendMessage class constructor
        this.UserModel = UserModel;
    }
    async generateAccessRefreshToken(userId: mongoose.Schema.Types.ObjectId | undefined): Promise<{ access_token: string | undefined, refresh_token: string | undefined }> {
        try {
            const user: UserType | null = await this.UserModel.findById(userId);
            if (!user) {
                throw new ApiError("User not found", 404);
            }
            const access_token: string | undefined = user?.generateAccess_token();
            const refresh_token: string | undefined = user?.generateRefresh_token();
            user!.refreshtoken = refresh_token;
            await user.save({ validateBeforeSave: false });
            return { access_token, refresh_token };
        } catch (error: any) {
            throw new ApiError(error, 500);
        }
    }

    registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, username, phonenumber, password, role } = req.body;
        if (!email || !username || !password || !phonenumber) {
            throw new ApiError("Please enter all required fields", 400);
        }
        const userExists: InstanceType<typeof this.UserModel> | null = await this.UserModel.findOne({
            $or: [{ username }, { email }],
        }).select("_id");

        if (userExists) {
            throw new ApiError("User already Exists", 409);
        }

        const user: InstanceType<typeof this.UserModel> | null = await this.UserModel.create({
            email,
            username,
            phonenumber,
            password,
            role: role || userRoleEnum.USER,
        });

        return res.status(200).json({
            message: "User registered successfully. A verification email has been sent to your email.",
            user: user.email + "," + user.username,
        });
    });

    loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, username, password } = req.body;

        if (!username || !password) {
            throw new ApiError("Please enter all required fields", 400);
        }

        const user: UserType | null = await this.UserModel.findOne({
            $or: [{ username }, { email }]
        }).select("_id email username +password");
        if (!user) {
            throw new ApiError("User account doesn't exist, please register as a new user", 404);
        }

        const isPasswordCorrect: boolean = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            throw new ApiError("Your credentials are incorrect", 401);
        }

        const { access_token, refresh_token } = await this.generateAccessRefreshToken(user._id);

        const options: { httpOnly: boolean; secure: boolean; } = {
            httpOnly: true,
            secure: true
        };
        return res
            .status(200)
            .cookie("access_token", access_token, options)
            .cookie("refresh_token", refresh_token, options)
            .json({
                message: "User logged in successfully",
                access_token: access_token,
            });
    });

    loginWithOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { phonenumber, otp } = req.body;
        if (!phonenumber) {
            throw new ApiError("Phone number is required", 400);
        }

        if (phonenumber && otp) {
            const storedOtpData: { otp: string; expiresAt: number } = otpStore.get(phonenumber);   //getting the stored otp from sendmessage class

            if (!storedOtpData || storedOtpData.otp !== otp || storedOtpData.expiresAt < Date.now()) {
                throw new ApiError("Entered OTP is incorrect or has expired", 401);
            }

            const user: UserType | null = await this.UserModel.findOne({ phonenumber }).select("_id");
            const userId: mongoose.Schema.Types.ObjectId|undefined = user?._id;
            if (!user) {
                throw new ApiError("User not found", 404);
            } ``

            const tokens: { access_token: string | undefined, refresh_token: string | undefined } = await this.generateAccessRefreshToken(userId);

            const options: { httpOnly: boolean; secure: boolean } = {
                httpOnly: true,
                secure: true,
            };
            return res
                .status(200)
                .cookie("access_token", tokens?.access_token, options)
                .cookie("refresh_token", tokens?.refresh_token, options)
                .json({
                    message: "User logged in successfully",
                    access_token: tokens?.access_token,
                });
        }
        const generatedotp = generateOTP();
        const message = `your login OTP: ${generatedotp}`;
        const messageService = new SendMessage(phonenumber, message);
        await messageService.sendMessage();
        otpStore.set(phonenumber, { otp: generatedotp, expiresAt: Date.now() + 5 * 60 * 1000 });

        return res.status(200).json({ message: "Your OTP has been sent to the phone number" });
    });

    logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await this.UserModel.findByIdAndUpdate(req.user?._id, {
            $set: { refreshtoken: "" }
        },
            { new: true }
        )
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .clearCookie("access_token", options)
            .clearCookie("refresh_token", options)
            .json({ message: "User logged out successfully" });
    })
}

export const userController = new UserController(User);