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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("../../utils/ApiError");
const CloudUpload_1 = require("../../services/social/CloudUpload");
const post_model_1 = require("../../models/social/post.model");
const AttachUser_1 = require("../../utils/AttachUser");
const fs_1 = require("fs");
const Post_services_1 = require("../../services/social/Post.services");
class PostController {
    constructor() {
        this.CreatePost = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession(); //starting a session using mongoose
            const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
            try {
                session.startTransaction();
                const { content, tags } = req.body;
                const file = req.file;
                if (!file || !file.path) {
                    throw new ApiError_1.ApiError("File is required and must be valid.", 400);
                }
                const imageUrl = yield (0, CloudUpload_1.CloudUpload)(file.path);
                const post = yield post_model_1.SocialPost.create({
                    content: content,
                    tags: tags,
                    image: imageUrl,
                    author: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id
                });
                yield session.commitTransaction();
                yield fs_1.promises.unlink(file.path); //deleting the saved file
                return res
                    .status(201)
                    .json({
                    message: "post created successfully",
                    post: post
                });
            }
            catch (error) {
                yield session.abortTransaction();
                throw new ApiError_1.ApiError(error === null || error === void 0 ? void 0 : error.message, 500);
            }
            finally {
                session.endSession();
            }
        }));
        this.getSocialPost = (0, AsyncHandler_1.asyncHandler)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = (0, AttachUser_1.getUserFromRequest)(req);
            const { page, limit } = req.body;
            const postServices = new Post_services_1.PostServcies();
            const posts = yield postServices.getPostbyUsername(currentUser === null || currentUser === void 0 ? void 0 : currentUser.username, page, limit);
            return res
                .status(200)
                .json({
                message: "your posts are fetched",
                posts: posts
            });
        }));
    }
}
exports.postController = new PostController();
