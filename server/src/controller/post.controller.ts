import type { Request, Response } from "express";
import  prisma  from "../lib/db/dbConnect.js";
import {
    createPostSchema,
    updatePostSchema,
} from "../validators/post.validator.js";

// ─────────────────────────────────────────────
// POST /api/posts
// Create a new post (auth required)
// ─────────────────────────────────────────────
export async function createPost(req: Request, res: Response) {
    const parsed = createPostSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { content, category, stressRating } = parsed.data;
    const authorId = req.session.user.id;

    try {
        const post = await prisma.posts.create({
            data: {
                content,
                category,
                stressRating,
                authorId,
            },
            include: {
                author: {
                    select: { id: true, name: true, image: true },
                },
            },
        });

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
                        select: { id: true, name: true, image: true },
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
                    select: { id: true, name: true, image: true },
                },
                comments: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        author: {
                            select: { id: true, name: true, image: true },
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
                        select: { id: true, name: true, image: true },
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
                                select: { id: true, name: true, image: true },
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
                    select: { id: true, name: true, image: true },
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
