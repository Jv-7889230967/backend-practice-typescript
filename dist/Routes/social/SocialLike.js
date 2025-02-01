"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Like_controller_1 = require("../../controllers/social/Like.controller");
const AuthMiddleware_1 = require("../../middlewares/AuthMiddleware");
const router = (0, express_1.Router)();
router.use(AuthMiddleware_1.authMiddleware);
router.route("/like-unlike-post").post(Like_controller_1.likeController.likeUnlikePost);
exports.default = router;
