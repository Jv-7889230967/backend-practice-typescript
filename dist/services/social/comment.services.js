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
exports.CommentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comment_model_1 = require("../../models/social/comment.model");
class CommentServices {
    constructor() {
        this.getReplies = (commentId, page, limit) => __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const replies = yield comment_model_1.commentModal.aggregate([
                {
                    $match: {
                        commentId: new mongoose_1.default.Types.ObjectId(commentId)
                    }
                },
                {
                    $project: {
                        _id: 0,
                        content: 1,
                        commentId: 1,
                        author: 1,
                    }
                },
                {
                    $skip: offset !== null && offset !== void 0 ? offset : 0
                },
                {
                    $limit: limit !== null && limit !== void 0 ? limit : 10
                }
            ]);
            return replies;
        });
    }
}
exports.CommentServices = CommentServices;
