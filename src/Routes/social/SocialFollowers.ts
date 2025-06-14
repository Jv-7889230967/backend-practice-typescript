import { Router } from "express";
import { FollowersService } from "../../controllers/social/FollowProfile.controller";
import { authMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

router.use(authMiddleware);

router.route("/follow/:tobeFollowedId").post(FollowersService.followUser);
router.route("/unfollow/:tobeUnFollowedId").post(FollowersService.UnFollowuser);
router.route("/profile_by_username").get(FollowersService.getFollowersByUserName);

export default router;