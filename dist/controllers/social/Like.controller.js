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
exports.likeController = void 0;
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const like_models_1 = require("../../models/social/like.models");
const AttachUser_1 = require("../../utils/AttachUser");
class LikeController {
    constructor() {
        this.likeUnlikePost = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { postId, commentId } = req.body;
            const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
            const isAlreadyLiked = yield like_models_1.LikeModel.findOne({
                postId: postId,
                commentId: commentId,
                likedBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id
            });
            if (isAlreadyLiked) {
                yield like_models_1.LikeModel.deleteOne({
                    likedBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id
                });
                return res
                    .status(200)
                    .json({
                    message: "Post is unliked successfully",
                });
            }
            else {
                const likedPostorComment = yield like_models_1.LikeModel.create({
                    postId: postId,
                    commentId: commentId,
                    likedBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id
                });
                return res
                    .status(201)
                    .json({
                    message: "post liked successfully",
                    likedPostorComment: likedPostorComment
                });
            }
        }));
    }
}
exports.likeController = new LikeController();
