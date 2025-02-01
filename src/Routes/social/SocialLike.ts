import { Router } from "express";
import { likeController } from "../../controllers/social/Like.controller.js";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";


const router = Router();
router.use(authMiddleware);
router.route("/like-unlike-post").post(likeController.likeUnlikePost);

export default router;