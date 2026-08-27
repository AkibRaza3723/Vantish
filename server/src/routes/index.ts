import type { Express } from "express";
import commentRouter from "./comments.js";
import postRouter from "./post.routes.js";

export function routes(app : Express){
    
    app.use("/api/v1/post", postRouter);
    app.use("/api/v1/comment", commentRouter);
    // votes are nested under postRouter → /api/v1/post/:postId/vote
    // no separate top-level registration needed
}