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
exports.CheckProfile = void 0;
const ApiError_1 = require("../../utils/ApiError");
const profile_model_1 = require("../../models/social/profile.model");
const follow_model_1 = require("../../models/social/follow.model");
class CheckProfile {
    constructor(userId) {
        this.getProfile = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield profile_model_1.SocialProfile.findOne({ owner: this.userId });
                return profile;
            }
            catch (error) {
                throw new ApiError_1.ApiError(error !== null && error !== void 0 ? error : "use not found", 404);
            }
        });
        this.checkProfile = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const profileExist = yield profile_model_1.SocialProfile.findOne({ owner: this.userId }).select("_id");
                if (profileExist) {
                    return true;
                }
                return false;
            }
            catch (error) {
                return error;
            }
        });
        this.followCheck = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const profileExist = yield this.checkProfile();
                if (!profileExist) {
                    throw new ApiError_1.ApiError("profile does not exist", 404);
                }
                const isFollowing = yield follow_model_1.SocialFollow.findOne({ followerId: this.userId }).select("_id");
                if (!isFollowing) {
                    return false;
                }
                return true;
            }
            catch (error) {
                throw new ApiError_1.ApiError(error === null || error === void 0 ? void 0 : error.message, error.status);
            }
        });
        this.userId = userId;
    }
}
exports.CheckProfile = CheckProfile;
