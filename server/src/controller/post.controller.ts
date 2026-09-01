import type { Request, Response } from "express";
import prisma from "../lib/db/dbConnect.js";
import imagekit, { toFile } from "../lib/imagekit.js";
import {
    createPostSchema,
    updatePostSchema,
} from "../validators/post.validator.js";
import { notificationService } from "../services/notification.service.js";
import { NotificationType } from "../generated/prisma/enums.js";

export async function createPost(req: Request, res: Response) {
    const parsed = createPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { content, category, stressRating } = parsed.data;
    const authorId = req.session.user.id;

    try {
        // Upload image to ImageKit if one was attached
        let imageUrl: string | undefined;
        if (req.file) {
            const file = await toFile(req.file.buffer, req.file.originalname, {
                type: req.file.mimetype,
            });
            const uploaded = await imagekit.files.upload({
                file,
                fileName: `post_${authorId}_${Date.now()}_${req.file.originalname}`,
                folder: "/posts",
                useUniqueFileName: true,
            });
            imageUrl = uploaded.url;
        }

        const post = await prisma.posts.create({
            data: {
                content,
                category,
                stressRating,
                authorId,
                ...(imageUrl && { imageUrl }),
            },
            include: {
                author: {
                    select: { id: true, username: true, avatarUrl: true },
                },
            },
        });

        // Trigger notifications for accepted connections
        try {
            const author = await prisma.user.findUnique({
                where: { id: authorId },
                select: { username: true }
            });
            const actorName = author?.username ? `@${author.username}` : "Anonymous";

            const connections = await prisma.connection.findMany({
                where: {
                    status: "ACCEPTED",
                    OR: [{ senderId: authorId }, { receiverId: authorId }],
                },
                select: {
                    senderId: true,
                    receiverId: true,
                },
            });

            const recipientIds = connections.map(c => 
                c.senderId === authorId ? c.receiverId : c.senderId
            );

            for (const recipientId of recipientIds) {
                await notificationService.create({
                    userId: recipientId,
                    actorId: authorId,
                    type: NotificationType.CONNECTION_POST,
                    message: `${actorName} created a new post.`,
                    postId: post.id,
                });
            }
        } catch (notifErr) {
            console.error("Failed to trigger CONNECTION_POST notifications:", notifErr);
        }

        return res.status(201).json({ message: "Post created", post });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────
// GET /api/posts/feed
// List all posts for feed (paginated, auth required)
// ─────────────────────────────────────────────
export async function getFeed(req: Request, res: Response) {
    // pagination via query params: ?page=1&limit=10
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const [posts, total] = await Promise.all([
            prisma.posts.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    author: {
                        select: { id: true, username: true, avatarUrl: true, organizations: true },
                    },
                    _count: {
                        select: { comments: true, votes: true },
                    },
                },
            }),
            prisma.posts.count(),
        ]);

        return res.status(200).json({
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────
// GET /api/posts/:postId
// Get a single post by ID (auth required)
// ─────────────────────────────────────────────
export async function getPostById(req: Request, res: Response) {
    const { postId } = req.params;

    try {
        const post = await prisma.posts.findUnique({
            where: { id: postId as string },
            include: {
                author: {
                    select: { id: true, username: true, avatarUrl: true, organizations: true },
                },
                comments: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        author: {
                            select: { id: true, username: true, avatarUrl: true, organizations: true },
                        },
                    },
                },
                _count: {
                    select: { comments: true, votes: true },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────
// GET /api/posts/user/:userId
// Get all posts by a specific user (auth required)
// ─────────────────────────────────────────────
export async function getPostsByUser(req: Request, res: Response) {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const [posts, total] = await Promise.all([
            prisma.posts.findMany({
                where: { authorId: userId as string},
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    author: {
                        select: { id: true, username: true, avatarUrl: true, organizations: true },
                    },
                    _count: {
                        select: { comments: true, votes: true },
                    },
                    comments:{
                        select:{
                            id: true,
                            content: true,
                            createdAt: true,
                            author: {
                                select: { id: true, username: true, avatarUrl: true, organizations: true },
                            },
                        }
                    }
                },
            }),
            prisma.posts.count({ where: { authorId: userId as string} }),
        ]);

        return res.status(200).json({
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────
// PUT /api/posts/:postId
// Update a post (auth required, only author)
// ─────────────────────────────────────────────
export async function updatePost(req: Request, res: Response) {
    const { postId } = req.params;
    const userId = req.session.user.id;

    const parsed = updatePostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    try {
        // 1. Find the post first
        const existing = await prisma.posts.findUnique({
            where: { id: postId as string },
        });

        if (!existing) {
            return res.status(404).json({ error: "Post not found" });
        }

        // 2. Authorization check — only author can update
        if (existing.authorId !== userId) {
            return res.status(403).json({ error: "Forbidden: You are not the author" });
        }
        const data:Record<string, unknown> = {};
        if(parsed.data.content){
            data.content = parsed.data.content;
        }
        if(parsed.data.category){
            data.category = parsed.data.category;
        }
        if(parsed.data.stressRating){
            data.stressRating = parsed.data.stressRating;
        }

        // 3. Update
        const updated = await prisma.posts.update({
            where: { id: postId as string },
            data: data,
            include: {
                author: {
                    select: { id: true, username: true, avatarUrl: true },
                },
            },
        });

        return res.status(200).json({ message: "Post updated", post: updated });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────
// DELETE /api/posts/:postId
// Delete a post (auth required, only author)
// ─────────────────────────────────────────────
export async function deletePost(req: Request, res: Response) {
    const { postId } = req.params;
    const userId = req.session.user.id;

    try {
        // 1. Find the post
        const existing = await prisma.posts.findUnique({
            where: { id: postId as string},
        });

        if (!existing) {
            return res.status(404).json({ error: "Post not found" });
        }

        // 2. Authorization check
        if (existing.authorId !== userId) {
            return res.status(403).json({ error: "Forbidden: You are not the author" });
        }

        // 3. Delete — cascades to votes, comments, moderationFlags (per schema)
        await prisma.posts.delete({ where: { id: postId as string } });

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────
// POST /api/v1/post/:postId/report
// Report a post (auth required). Auto-deletes at 5 reports.
// ─────────────────────────────────────────────
export async function reportPost(req: Request, res: Response) {
    const { postId } = req.params;
    const reporterId = req.session.user.id;
    const { reason } = req.body;

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
        return res.status(400).json({ error: "A reason is required to report a post" });
    }

    try {
        // 1. Make sure the post exists
        const post = await prisma.posts.findUnique({
            where: { id: postId as string },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // 2. Prevent the author from reporting their own post
        if (post.authorId === reporterId) {
            return res.status(403).json({ error: "You cannot report your own post" });
        }

        // 3. Create the flag (unique constraint prevents duplicates per user)
        try {
            await prisma.moderationFlags.create({
                data: {
                    postId: postId as string,
                    reporterId: reporterId as string,
                    reason: reason.trim(),
                },
            });
        } catch (err: any) {
            // Unique constraint violation → user already reported this post
            if (err?.code === "P2002") {
                return res.status(409).json({ error: "You have already reported this post" });
            }
            throw err;
        }

        // 4. Count total reports for this post
        const flagCount = await prisma.moderationFlags.count({
            where: { postId: postId as string },
        });

        const REPORT_THRESHOLD = 5;

        // 5. Auto-delete the post once it hits the threshold
        if (flagCount >= REPORT_THRESHOLD) {
            await prisma.posts.delete({ where: { id: postId as string } });
            return res.status(200).json({
                message: "Post has been removed due to multiple reports",
                autoDeleted: true,
            });
        }

        // Trigger notification (anonymous reporter)
        try {
            await notificationService.create({
                userId: post.authorId,
                actorId: null, // Keep reporter anonymous
                type: NotificationType.POST_REPORTED,
                message: "Your post has been reported and is under review.",
                postId: post.id,
            });
        } catch (notifErr) {
            console.error("Failed to create post reported notification:", notifErr);
        }

        return res.status(201).json({
            message: "Post reported successfully",
            autoDeleted: false,
            reportCount: flagCount,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

//Report endpoint behaviour:
// 400 — missing/empty reason
// 404 — post doesn't exist
// 403 — author trying to report their own post
// 409 — user already reported this post
// 201 — report recorded (returns reportCount)
// 200 + autoDeleted: true — post auto-deleted after reaching 5 reports