import { Router } from "express";
import { postController } from "../../controllers/social/Post.controller";
import { authMiddleware } from "../../middlewares/AuthMiddleware";
import { upload } from "../../middlewares/MulterMiddleware";

const router = Router();

router.use(authMiddleware);

router.route("/create-post").post(upload.single('postContent'), postController.CreatePost)
router.route("/get-my-posts").get(postController.getSocialPost);

export default router