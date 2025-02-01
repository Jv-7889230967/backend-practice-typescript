"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SocialProfile_controllers_1 = require("../../controllers/social/SocialProfile.controllers");
const AuthMiddleware_1 = require("../../middlewares/AuthMiddleware");
const router = (0, express_1.Router)();
router.route("/create-profile").post(AuthMiddleware_1.authMiddleware, SocialProfile_controllers_1.socialProfileController.createSocialProfile);
router.route("/get-profile").get(AuthMiddleware_1.authMiddleware, SocialProfile_controllers_1.socialProfileController.getSocialProfile);
exports.default = router;
