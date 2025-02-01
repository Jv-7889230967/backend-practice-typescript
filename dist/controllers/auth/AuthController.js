"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const constants_1 = require("../../constants");
const ApiError_1 = require("../../utils/ApiError");
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const GenerateOTP_1 = require("../../utils/GenerateOTP");
const TemporaryStorage_1 = require("../../utils/TemporaryStorage");
const UserModels_1 = require("../../models/auth/UserModels");
const AttachUser_1 = require("../../utils/AttachUser");
const SendMessage_1 = require("../../services/shared/SendMessage");
class UserController extends SendMessage_1.SendMessage {
    constructor(UserModel) {
        super(0, ""); //sending default value for sendMessage class constructor
        this.registerUser = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, username, phonenumber, password, role } = req.body;
            if (!email || !username || !password || !phonenumber) {
                throw new ApiError_1.ApiError("Please enter all required fields", 400);
            }
            const userExists = yield this.UserModel.findOne({
                $or: [{ username }, { email }],
            }).select("_id");
            if (userExists) {
                throw new ApiError_1.ApiError("User already Exists", 409);
            }
            const user = yield this.UserModel.create({
                email,
                username,
                phonenumber,
                password,
                role: role || constants_1.userRoleEnum.USER,
            });
            return res.status(200).json({
                message: "User registered successfully. A verification email has been sent to your email.",
                user: user.email + "," + user.username,
            });
        }));
        this.loginUser = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, username, password } = req.body;
            if (!username || !password) {
                throw new ApiError_1.ApiError("Please enter all required fields", 400);
            }
            const user = yield this.UserModel.findOne({
                $or: [{ username }, { email }]
            }).select("_id email username +password");
            if (!user) {
                throw new ApiError_1.ApiError("User account doesn't exist, please register as a new user", 404);
            }
            const isPasswordCorrect = yield user.isPasswordCorrect(password);
            if (!isPasswordCorrect) {
                throw new ApiError_1.ApiError("Your credentials are incorrect", 401);
            }
            const { access_token, refresh_token } = yield this.generateAccessRefreshToken(user._id);
            const options = {
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
        }));
        this.loginWithOtp = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { phonenumber, otp } = req.body;
            if (!phonenumber) {
                throw new ApiError_1.ApiError("Phone number is required", 400);
            }
            if (phonenumber && otp) {
                const storedOtpData = TemporaryStorage_1.otpStore.get(phonenumber); //getting the stored otp from sendmessage class
                if (!storedOtpData || storedOtpData.otp !== otp || storedOtpData.expiresAt < Date.now()) {
                    throw new ApiError_1.ApiError("Entered OTP is incorrect or has expired", 401);
                }
                const user = yield this.UserModel.findOne({ phonenumber }).select("_id");
                const userId = user === null || user === void 0 ? void 0 : user._id;
                if (!user) {
                    throw new ApiError_1.ApiError("User not found", 404);
                }
                const tokens = yield this.generateAccessRefreshToken(userId);
                const options = {
                    httpOnly: true,
                    secure: true,
                };
                return res
                    .status(200)
                    .cookie("access_token", tokens === null || tokens === void 0 ? void 0 : tokens.access_token, options)
                    .cookie("refresh_token", tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token, options)
                    .json({
                    message: "User logged in successfully",
                    access_token: tokens === null || tokens === void 0 ? void 0 : tokens.access_token,
                });
            }
            const generatedotp = (0, GenerateOTP_1.generateOTP)();
            const message = `your login OTP: ${generatedotp}`;
            const messageService = new SendMessage_1.SendMessage(phonenumber, message);
            yield messageService.sendMessage();
            TemporaryStorage_1.otpStore.set(phonenumber, { otp: generatedotp, expiresAt: Date.now() + 5 * 60 * 1000 });
            return res.status(200).json({ message: "Your OTP has been sent to the phone number" });
        }));
        this.logoutUser = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
            yield this.UserModel.findByIdAndUpdate(currentUser === null || currentUser === void 0 ? void 0 : currentUser._id, {
                $set: { refreshtoken: "" }
            }, { new: true });
            const options = {
                httpOnly: true,
                secure: true,
            };
            return res
                .status(200)
                .clearCookie("access_token", options)
                .clearCookie("refresh_token", options)
                .json({ message: "User logged out successfully" });
        }));
        this.UserModel = UserModel;
    }
    generateAccessRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.UserModel.findById(userId);
                if (!user) {
                    throw new ApiError_1.ApiError("User not found", 404);
                }
                const access_token = user === null || user === void 0 ? void 0 : user.generateAccess_token();
                const refresh_token = user === null || user === void 0 ? void 0 : user.generateRefresh_token();
                user.refreshtoken = refresh_token;
                yield user.save({ validateBeforeSave: false });
                return { access_token, refresh_token };
            }
            catch (error) {
                throw new ApiError_1.ApiError(error, 500);
            }
        });
    }
}
exports.userController = new UserController(UserModels_1.User);
