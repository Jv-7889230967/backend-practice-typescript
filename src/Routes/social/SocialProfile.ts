import { Router } from "express";
import { socialProfileController } from "../../controllers/social/SocialProfile.controllers.js";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";

const router = Router();

router.route("/create-profile").post(authMiddleware, socialProfileController.createSocialProfile);
router.route("/get-profile").get(authMiddleware, socialProfileController.getSocialProfile);

export default router;
