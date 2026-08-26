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

const router = Router();

// Public routes (no login required)
router.get("/feed", getFeed);
router.get("/user/:userId", getPostsByUser);
router.get("/:postId", getPostById);

// Protected routes (login required)
router.post("/", requireAuth, createPost);
router.put("/:postId", requireAuth, updatePost);
router.delete("/:postId", requireAuth, deletePost);

export default router;
