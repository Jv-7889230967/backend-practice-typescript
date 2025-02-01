import { Router } from "express";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";
import { commentController } from "../../controllers/social/Comment.controller.js";

const router = Router();

router.use(authMiddleware);

router.route("/add-comment").post(commentController.PostComment)
router.route("/delete-comment").delete(commentController.DeleteComment)
router.route("/update-comment").put(commentController.UpdateComment);
router.route("/get-comment-replies").get(commentController.getCommentReplies);


export default router;