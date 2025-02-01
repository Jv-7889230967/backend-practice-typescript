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
exports.socialProfileController = void 0;
const profile_model_1 = require("../../models/social/profile.model");
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const AttachUser_1 = require("../../utils/AttachUser");
const ApiError_1 = require("../../utils/ApiError");
const CheckProfile_1 = require("../../services/social/CheckProfile");
const SendMessage_1 = require("../../services/shared/SendMessage");
class SocialProfileController extends SendMessage_1.SendMessage {
    constructor(profileModel) {
        super(0, '');
        /**
         * @param reqObject
         * @description function to create a social profile for a logined user by accessing the set user details in the req object
         */
        this.createSocialProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
            if (!currentUser) {
                throw new ApiError_1.ApiError("Please login", 401);
            }
            const { coverImage, firstName, lastName, bio, DOB, location, countryCode } = req.body;
            if (!firstName || !lastName || !bio || !DOB || !countryCode) {
                throw new ApiError_1.ApiError("please fill all required fields", 401);
            }
            const checkProfle = new CheckProfile_1.CheckProfile(currentUser === null || currentUser === void 0 ? void 0 : currentUser._id);
            const profileExists = yield checkProfle.checkProfile();
            if (profileExists) {
                throw new ApiError_1.ApiError("Social Profile Already exist", 409);
            }
            const profileData = Object.assign(Object.assign({}, req.body), { owner: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id });
            const socialProfile = yield this.profileModel.create(profileData);
            const populatedData = yield socialProfile.populate("owner");
            return res
                .status(201).json({
                message: "your social profile has been created",
                profile: populatedData
            });
        }));
        /**
         * @param req object to get the currnt user id
         * @description function to get the social profile of the logged in user.
         */
        this.getSocialProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
            const Checkprofile = new CheckProfile_1.CheckProfile(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id);
            const profile = yield Checkprofile.getProfile();
            if (!profile) {
                throw new ApiError_1.ApiError("Social Profile does not exists", 404);
            }
            return res.status(200).json({
                message: "your social profil",
                profile: profile
            });
        }));
        this.profileModel = profileModel;
    }
}
exports.socialProfileController = new SocialProfileController(profile_model_1.SocialProfile);
