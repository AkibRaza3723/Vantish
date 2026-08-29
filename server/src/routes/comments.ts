import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    createComment,
    updateComment,
    getComments,
    deleteComment,
    reportComment,
} from "../controller/comments.js";

const commentRouter = Router();

commentRouter.post("/", requireAuth, createComment);
commentRouter.patch("/:id", requireAuth, updateComment);
commentRouter.get("/:postId", getComments); //only public route 
commentRouter.delete("/:commentId", requireAuth, deleteComment);
commentRouter.post("/:commentId/report", requireAuth, reportComment);

export default commentRouter;