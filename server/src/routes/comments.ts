import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    createComment,
    updateComment,
    getComments,
    deleteComment,
} from "../controller/comments.js";

const commentRouter = Router();

commentRouter.post("/", requireAuth, createComment);
commentRouter.patch("/:id", requireAuth, updateComment);
commentRouter.get("/:postId", getComments); //only public route 
commentRouter.delete("/:id", requireAuth, deleteComment);

export default commentRouter;