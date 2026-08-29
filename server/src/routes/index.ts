import type { Express } from "express";
import commentRouter from "./comments.js";
import postRouter from "./post.routes.js";
import userRouter from "./user.routes.js";
import connectionRouter from "./connection.routes.js";

export function routes(app : Express){
    
    app.use("/api/post", postRouter);
    app.use("/api/comment", commentRouter);
    // votes are nested under postRouter → /api/post/:postId/vote
    // no separate top-level registration needed
    app.use("/api/user", userRouter);
    app.use("/api/connection", connectionRouter);
}