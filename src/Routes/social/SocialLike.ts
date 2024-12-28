import { Router } from "express";
import { likeController } from "../../controllers/social/Like.controller";
import { authMiddleware } from "../../middlewares/AuthMiddleware";


const router = Router();
router.use(authMiddleware);
router.route("/like-unlike-post").post(likeController.likeUnlikePost);

export default router;