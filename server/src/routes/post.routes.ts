import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    createPost,
    getFeed,
    getPostById,
    getPostsByUser,
    updatePost,
    deletePost,
} from "../controller/post.controller.js";
import voteRouter from "./votes.routes.js";

const postRouter = Router();

// Public routes (no login required)
postRouter.get("/feed", getFeed);
postRouter.get("/user/:userId", getPostsByUser);
postRouter.get("/:postId", getPostById);

// Protected routes (login required)
postRouter.post("/",  createPost);
postRouter.put("/:postId", updatePost);
postRouter.delete("/:postId",  deletePost);

// ── Nested: /api/v1/post/:postId/vote  &  /api/v1/post/:postId/votes ──
postRouter.use("/:postId/vote", voteRouter);   // POST  (cast/toggle)
postRouter.use("/:postId/votes", voteRouter);  // GET   (all votes + /me)

export default postRouter;
