import { Router } from "express";
import { userController } from "../controllers/auth/AuthController";
import { authMiddleware } from "../middlewares/AuthMiddleware";


const router=Router();

router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
router.route('/logout').post(authMiddleware,userController.logoutUser);
router.route('/loginwithotp').post(userController.loginWithOtp);

export default router;