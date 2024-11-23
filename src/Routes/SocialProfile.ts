import { Router } from "express";
import { socialProfileController } from "../controllers/social/SocialProfile.controllers";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.route("/create-profile").post(authMiddleware, socialProfileController.createSocialProfile);

export default router;
