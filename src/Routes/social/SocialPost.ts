import { Router } from "express";
import { postController } from "../../controllers/social/Post.controller.js";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";
import { upload } from "../../middlewares/MulterMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/create-post").post(upload.single('postContent'), postController.CreatePost)
router.route("/get-my-posts").get(postController.getSocialPost);

export default router