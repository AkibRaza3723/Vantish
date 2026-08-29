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
postRouter.get("/feed", requireAuth, getFeed);
postRouter.get("/user/:userId", requireAuth, getPostsByUser);
postRouter.get("/:postId", requireAuth, getPostById);

// Protected routes (login required)
postRouter.post("/", requireAuth, upload.single("image"), createPost);
postRouter.put("/:postId", requireAuth, updatePost);
postRouter.delete("/:postId", requireAuth, deletePost);
postRouter.post("/:postId/report", requireAuth, reportPost);

// ── Nested: /api/v1/post/:postId/vote  &  /api/v1/post/:postId/votes ──
postRouter.use("/:postId/vote", voteRouter);   // POST  (cast/toggle)
postRouter.use("/:postId/votes", voteRouter);  // GET   (all votes + /me)

export default postRouter;
