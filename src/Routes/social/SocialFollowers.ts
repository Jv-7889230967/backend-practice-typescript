import { Router } from "express";
import { userFollowUnfollow } from "../../controllers/social/FollowProfile.controller";
import { authMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

router.use(authMiddleware);

router.route("/follow/:tobeFollowedId").post(userFollowUnfollow.followUser);
router.route("/unfollow/:tobeUnFollowedId").post(userFollowUnfollow.UnFollowuser);

export default router;