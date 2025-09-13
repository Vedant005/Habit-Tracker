import { Router } from "express";
import { followUser, getFeed, getFollowing, unfollowUser } from "../controllers/follow";

const router = Router();

router.route("/:userId/following").get(getFollowing)
router.route("/feed").get(getFeed)
router.route("/:userId/follow").post(followUser);
router.route("/:userId/unfollow").post(unfollowUser)

export default router;