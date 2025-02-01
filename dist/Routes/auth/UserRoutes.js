"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../../controllers/auth/AuthController");
const AuthMiddleware_1 = require("../../middlewares/AuthMiddleware");
const passport_1 = __importDefault(require("passport"));
// import GoogleStrategy from "passport-google-oidc";
const router = (0, express_1.Router)();
router.route('/register').post(AuthController_1.userController.registerUser);
router.route('/login').post(AuthController_1.userController.loginUser);
router.route('/logout').post(AuthMiddleware_1.authMiddleware, AuthController_1.userController.logoutUser);
router.route('/loginwithotp').post(AuthController_1.userController.loginWithOtp);
router.route("/login/google").get(passport_1.default.authenticate("google"));
exports.default = router;
