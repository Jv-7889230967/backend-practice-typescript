import { Router } from "express";
import { userController } from "../../controllers/auth/AuthController.js";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";
import passport from "passport";
// import GoogleStrategy from "passport-google-oidc";

const router = Router();

router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
router.route('/logout').post(authMiddleware, userController.logoutUser);
router.route('/loginwithotp').post(userController.loginWithOtp);
router.route("/login/google").get(passport.authenticate("google"));

export default router;