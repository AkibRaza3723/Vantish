import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    createComment,
    updateComment,
    getComments,
    deleteComment,
} from "../controller/comments.js";

const router = Router();

router.post("/", requireAuth, createComment);
router.patch("/:id", requireAuth, updateComment);
router.get("/:postId", getComments); //only public route 
router.delete("/:id", requireAuth, deleteComment);

export default router;