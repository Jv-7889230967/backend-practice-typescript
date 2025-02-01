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
exports.commentController = void 0;
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const AttachUser_1 = require("../../utils/AttachUser");
const comment_model_1 = require("../../models/social/comment.model");
const ApiError_1 = require("../../utils/ApiError");
const comment_services_1 = require("../../services/social/comment.services");
class CommentController extends comment_services_1.CommentServices {
    constructor() {
        super(...arguments);
        this.PostComment = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { content, postId, commentId } = req.body;
                const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
                const addedComment = yield comment_model_1.commentModal.create({
                    content: content,
                    postId: postId,
                    commentId: commentId,
                    author: currentUser._id,
                });
                return res
                    .status(201)
                    .json({
                    message: "your comment is been Added",
                    comment: addedComment
                });
            }
            catch (error) {
                throw new ApiError_1.ApiError((error === null || error === void 0 ? void 0 : error.message) || "Error adding comment", 500);
            }
        }));
        this.DeleteComment = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId } = req.body;
                yield comment_model_1.commentModal.findByIdAndDelete({ _id: commentId });
                return res
                    .status(200)
                    .json({
                    message: "comment deleted successfully"
                });
            }
            catch (error) {
                throw new ApiError_1.ApiError((error === null || error === void 0 ? void 0 : error.message) || "Error deleting the comment", 500);
            }
        }));
        this.UpdateComment = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { commentId, content } = req.body;
            if (!commentId || !content) {
                throw new ApiError_1.ApiError("please fill all required field", 400);
            }
            const updatedComment = yield comment_model_1.commentModal.findByIdAndUpdate(commentId, { content }, { new: true, runValidators: true }).select("-_id -createdAt -updatedAt");
            if (!updatedComment) {
                throw new ApiError_1.ApiError("Comment not found", 404);
            }
            return res
                .status(200)
                .json({
                message: "your post updated successfully",
                updatedComment: updatedComment
            });
        }));
        this.getCommentReplies = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId, page, limit } = req.body;
                const getCommentReplies = new comment_services_1.CommentServices();
                const replies = yield getCommentReplies.getReplies(commentId, page, limit);
                return res
                    .status(200)
                    .json({
                    message: "comment repllies fetched successfully",
                    commentReplies: replies
                });
            }
            catch (error) {
                throw new ApiError_1.ApiError(error === null || error === void 0 ? void 0 : error.message, 500);
            }
        }));
    }
}
exports.commentController = new CommentController();
