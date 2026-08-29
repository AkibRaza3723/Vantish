import type { Request, Response } from "express";
import prisma from "../lib/db/dbConnect.js";
import {
    createCommentSchema,
    updateCommentSchema,
    reportCommentSchema,
} from "../validators/comment.validator.js";

export async function createComment(req: Request, res: Response) {
    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { postId, content } = parsed.data;
    const authorId = req.session.user.id;
    try {
        const comment = await prisma.comments.create({
            data: {
                postId,
                content,
                authorId,
            },
            include: {
                author: {
                    select: { id: true, name: true, image: true },
                },
            },
        }); 
        return res.status(201).json({ message: "Comment created", comment });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateComment(req: Request, res: Response) {
    const parsed = updateCommentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { content } = parsed.data;
    const commentId = String(req.params.id);   // cast: req.params is string | string[] | undefined
    //Express types req.params values as string | string[] | undefined because in theory a URL param could be an array or missing. But Prisma's where only accepts a plain string. (this gave error in first due to typeScript. cause it is strict in passing undefined value or null. and it will give error if we dont cast it to string.  )
    const authorId = req.session.user.id;   //from session id in local storage. and it store user data after login.
    try {
        //check the comment exists and belongs to this user
        const existing = await prisma.comments.findUnique({ where: { id: commentId } });
        if (!existing) return res.status(404).json({ error: "Comment not found" });
        if (existing.authorId !== authorId) return res.status(403).json({ error: "Forbidden" });

        // Now safe to update by id (the only unique field Prisma allows in update where)
        const comment = await prisma.comments.update({
            where: { id: commentId },
            data: { content },
            include: {
                author: {
                    select: { id: true, name: true, image: true },
                },
            },
        });
        return res.status(200).json({ message: "Comment updated", comment });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getComments(req: Request, res: Response) {
    const postId = String(req.params.postId);  
    try {
        const comments = await prisma.comments.findMany({
            where: { postId, isHidden: false },
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: { id: true, name: true, image: true },
                },
            },
        });
        return res.status(200).json({ comments });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteComment(req: Request, res: Response) {
    const commentId = String(req.params.comentId);  // cast: req.params is string | string[] | undefined
    const userId = req.session.user.id;

    const existing = await prisma.comments.findUnique({ where: { id: commentId } });
    if (!existing) return res.status(404).json({ error: "Comment not found" });
    if (existing.authorId !== userId) return res.status(403).json({ error: "Forbidden" });

    try {
        const comment = await prisma.comments.delete({
            where: { id: commentId },
        });
        return res.status(200).json({ message: "Comment deleted", comment });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function reportComment(req: Request, res: Response) {
    const commentId = String(req.params.commentId);
    const reporterId = req.session.user.id;

    const parsed = reportCommentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { reason } = parsed.data;

    try {
        // 1. Make sure the comment exists
        const comment = await prisma.comments.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // 2. Prevent the author from reporting their own comment
        if (comment.authorId === reporterId) {
            return res.status(403).json({ error: "You cannot report your own comment" });
        }

        // 3. Create the report flag (unique constraint prevents duplicates per user)
        try {
            await prisma.commentReportFlags.create({
                data: {
                    commentId,
                    reporterId,
                    reason: reason.trim(),
                },
            });
        } catch (err: any) {
            if (err?.code === "P2002") {
                return res.status(409).json({ error: "You have already reported this comment" });
            }
            throw err;
        }

        // 4. Hide the comment immediately on first report
        await prisma.comments.update({
            where: { id: commentId },
            data: { isHidden: true },
        });

        return res.status(201).json({
            message: "Comment reported and hidden successfully",
            hidden: true,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Report comment endpoint behaviour:
// 400 — missing/invalid reason
// 404 — comment doesn't exist
// 403 — author trying to report their own comment
// 409 — user already reported this comment
// 201 — report recorded, comment hidden (hidden: true)
