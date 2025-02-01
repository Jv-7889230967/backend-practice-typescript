"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FollowProfile_controller_1 = require("../../controllers/social/FollowProfile.controller");
const AuthMiddleware_1 = require("../../middlewares/AuthMiddleware");
const router = (0, express_1.Router)();
router.use(AuthMiddleware_1.authMiddleware);
router.route("/follow/:tobeFollowedId").post(FollowProfile_controller_1.FollowersService.followUser);
router.route("/unfollow/:tobeUnFollowedId").post(FollowProfile_controller_1.FollowersService.UnFollowuser);
router.route("/profile_by_username").get(FollowProfile_controller_1.FollowersService.getFollowersByUserName);
exports.default = router;
