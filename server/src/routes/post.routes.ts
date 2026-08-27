import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import upload from "../middleware/multer.js";
import {
    createPost,
    getFeed,
    getPostById,
    getPostsByUser,
    updatePost,
    deletePost,
    reportPost,
} from "../controller/post.controller.js";
import voteRouter from "./votes.routes.js";

const postRouter = Router();

// Public routes (no login required)
postRouter.get("/feed", getFeed);
postRouter.get("/user/:userId", getPostsByUser);
postRouter.get("/:postId", getPostById);

// Protected routes (login required)
postRouter.post("/", upload.single("image"), createPost);
postRouter.put("/:postId", updatePost);
postRouter.delete("/:postId", deletePost);
postRouter.post("/:postId/report", requireAuth, reportPost);

// ── Nested: /api/v1/post/:postId/vote  &  /api/v1/post/:postId/votes ──
postRouter.use("/:postId/vote", voteRouter);   // POST  (cast/toggle)
postRouter.use("/:postId/votes", voteRouter);  // GET   (all votes + /me)

export default postRouter;
