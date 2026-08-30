import type { Request, Response } from "express";
import prisma from "../lib/db/dbConnect.js";
import { castVoteSchema } from "../validators/vote.validator.js";
import { VoteType } from "../generated/prisma/enums.js";
import { notificationService } from "../services/notification.service.js";
import { NotificationType } from "../generated/prisma/enums.js";

// ─────────────────────────────────────────────
// POST /api/posts/:postId/vote
// Cast, change, or remove a vote (toggle behavior)
// Any authenticated user can vote — including on their own post
// ─────────────────────────────────────────────
export async function castOrToggleVote(req: Request, res: Response) {
    const { postId } = req.params;
    const voterId = req.session.user.id;

    // 1. Validate request body
    const parsed = castVoteSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { voteType } = parsed.data;

    try {
        // 2. Check if the post actually exists
        const post = await prisma.posts.findUnique({
            where: { id: postId as string },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // 3. Check if this user has already voted on this post
        const existingVote = await prisma.votes.findUnique({
            where: {
                postId_voterId:{
                    postId: postId as string,
                    voterId: voterId as string,
                },
            },
        });

        // ── CASE A: No existing vote → create a new one ──
        if (!existingVote) {
            const counterField = voteType === VoteType.RELATED ? "related" : "notRelated";

            const [newVote] = await prisma.$transaction([
                prisma.votes.create({
                    data: { postId: postId as string, voterId: voterId as string, voteType: voteType as VoteType },
                }),
                prisma.posts.update({
                    where: { id: postId as string },
                    data: { [counterField]: { increment: 1 } },
                }),
            ]);

            // Trigger notification
            try {
                const voter = await prisma.user.findUnique({
                    where: { id: voterId },
                    select: { username: true }
                });
                const actorName = voter?.username ? `@${voter.username}` : "Anonymous";
                const notifType = voteType === VoteType.RELATED ? NotificationType.POST_RELATED : NotificationType.POST_NOT_RELATED;
                const verb = voteType === VoteType.RELATED ? "related" : "not related";

                await notificationService.create({
                    userId: post.authorId,
                    actorId: voterId,
                    type: notifType,
                    message: `${actorName} marked your post as ${verb}.`,
                    postId: post.id,
                });
            } catch (notifErr) {
                console.error("Failed to create vote notification:", notifErr);
            }

            return res.status(201).json({ message: "Vote cast", vote: newVote });
        }

        // ── CASE B: Same vote again → toggle OFF (remove the vote) ──
        if (existingVote.voteType === voteType) {
            const counterField =
                voteType === VoteType.RELATED ? "related" : "notRelated";

            await prisma.$transaction([
                prisma.votes.delete({
                    where: { id: existingVote.id },
                }),
                prisma.posts.update({
                    where: { id: postId as string },
                    data: { [counterField]: { decrement: 1 } },
                }),
            ]);

            // Clean up notification
            try {
                const notifType = voteType === VoteType.RELATED ? NotificationType.POST_RELATED : NotificationType.POST_NOT_RELATED;
                await notificationService.deleteByPostAndActorAndType(post.id, voterId, notifType);
            } catch (notifErr) {
                console.error("Failed to delete vote notification:", notifErr);
            }

            return res.status(200).json({ message: "Vote removed" });
        }

        // ── CASE C: Different vote type → change the vote ──
        const oldCounterField =
            existingVote.voteType === VoteType.RELATED ? "related" : "notRelated";
        const newCounterField =
            voteType === VoteType.RELATED ? "related" : "notRelated";

        const [updatedVote] = await prisma.$transaction([
            prisma.votes.update({
                where: { id: existingVote.id },
                data: { voteType },
            }),
            prisma.posts.update({
                where: { id: postId as string },
                data: {
                    [oldCounterField]: { decrement: 1 },
                    [newCounterField]: { increment: 1 },
                },
            }),
        ]);

        // Change notification
        try {
            const oldNotifType = existingVote.voteType === VoteType.RELATED ? NotificationType.POST_RELATED : NotificationType.POST_NOT_RELATED;
            await notificationService.deleteByPostAndActorAndType(post.id, voterId, oldNotifType);

            const voter = await prisma.user.findUnique({
                where: { id: voterId },
                select: { username: true }
            });
            const actorName = voter?.username ? `@${voter.username}` : "Anonymous";
            const newNotifType = voteType === VoteType.RELATED ? NotificationType.POST_RELATED : NotificationType.POST_NOT_RELATED;
            const verb = voteType === VoteType.RELATED ? "related" : "not related";

            await notificationService.create({
                userId: post.authorId,
                actorId: voterId,
                type: newNotifType,
                message: `${actorName} marked your post as ${verb}.`,
                postId: post.id,
            });
        } catch (notifErr) {
            console.error("Failed to update vote notification:", notifErr);
        }

        return res.status(200).json({ message: "Vote changed", vote: updatedVote });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────
// GET /api/posts/:postId/votes
// Get all votes for a post (with voter info)
// ─────────────────────────────────────────────
export async function getVotesForPost(req: Request, res: Response) {
    const { postId } = req.params;

    try {
        const post = await prisma.posts.findUnique({ where: { id: postId as string } });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const votes = await prisma.votes.findMany({
            where: { postId: postId as string },
            select: {
                id: true,
                voteType: true,
                voter: {
                    select: { id: true, username: true, avatarUrl: true },
                },
            },
        });

        return res.status(200).json({
            postId,
            related: post.related,
            notRelated: post.notRelated,
            total: votes.length,
            votes,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────
// GET /api/posts/:postId/votes/me
// Get the current authenticated user's vote on a post
// ─────────────────────────────────────────────
export async function getMyVoteOnPost(req: Request, res: Response) {
    const { postId } = req.params;
    const voterId = req.session.user.id;

    try {
        const post = await prisma.posts.findUnique({ where: { id: postId as string } });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const vote = await prisma.votes.findUnique({
            where: {
                postId_voterId:{
                    postId: postId as string,
                    voterId: voterId as string,
                }
            },
        });

        if (!vote) {
            return res.status(200).json({ voted: false, voteType: null });
        }

        return res.status(200).json({ voted: true, voteType: vote.voteType });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
