import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    castOrToggleVote,
    getVotesForPost,
    getMyVoteOnPost,
} from "../controller/votes.controller.js";

const voteRouter = Router({ mergeParams: true }); // mergeParams to access :postId from parent router

// POST   /api/v1/post/:postId/vote     → Cast, change, or remove vote (toggle)
voteRouter.post("/", requireAuth, castOrToggleVote);

// GET    /api/v1/post/:postId/votes    → All votes on a post (counts + who voted)
voteRouter.get("/", requireAuth, getVotesForPost);

// GET    /api/v1/post/:postId/votes/me → Current user's vote on this post
voteRouter.get("/me", requireAuth, getMyVoteOnPost);

export default voteRouter;
