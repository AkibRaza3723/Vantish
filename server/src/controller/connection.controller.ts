import type { Request, Response } from "express";
import prisma from "../lib/db/dbConnect.js";
import { respondSchema } from "../validators/connection.validator.js";

// ─────────────────────────────────────────────────────────────────
// POST /api/v1/connection/send/:receiverId
// Logged-in user sends a connection request to another user.
// Guards: can't self-connect, can't send duplicate (unique constraint + app check)
// ─────────────────────────────────────────────────────────────────
export async function sendRequest(req: Request, res: Response) {
    const senderId = req.session.user.id;
    const { receiverId } = req.params;

    // Guard: can't send a request to yourself
    if (senderId === receiverId) {
        return res.status(400).json({ error: "You cannot send a connection request to yourself" });
    }

    try {
        // Guard: check if receiver exists
        const receiver = await prisma.user.findUnique({ where: { id: receiverId as string } });
        if (!receiver) {
            return res.status(404).json({ error: "User not found" });
        }

        // Guard: check if a connection already exists in either direction
        const existing = await prisma.connection.findFirst({
            where: {
                OR: [
                    { senderId, receiverId: receiverId as string },
                    { senderId: receiverId as string, receiverId: senderId },
                ],
            },
        });

        if (existing) {
            return res.status(409).json({
                error: "A connection request already exists between you two",
                status: existing.status,
            });
        }

        const connection = await prisma.connection.create({
            data: { senderId, receiverId: receiverId as string },
            select: {
                id: true,
                status: true,
                createdAt: true,
                receiver: { select: { id: true, username: true, avatarUrl: true } },
            },
        });

        return res.status(201).json({ message: "Connection request sent", connection });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────────────────────────
// PATCH /api/v1/connection/respond/:connectionId
// The RECEIVER accepts or rejects an incoming request.
// Body: { action: "ACCEPTED" | "REJECTED" }
// Guards: only the receiver can respond, only PENDING connections can be responded to
// ─────────────────────────────────────────────────────────────────
export async function respondToRequest(req: Request, res: Response) {
    const userId = req.session.user.id;
    const { connectionId } = req.params;

    const parsed = respondSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Validation failed",
            fieldErrors: parsed.error.flatten().fieldErrors,
        });
    }

    const { action } = parsed.data;

    try {
        const connection = await prisma.connection.findUnique({
            where: { id: connectionId as string },
        });

        if (!connection) {
            return res.status(404).json({ error: "Connection request not found" });
        }

        // Guard: only the receiver can accept or reject
        if (connection.receiverId !== userId) {
            return res.status(403).json({ error: "Only the receiver can respond to this request" });
        }

        // Guard: can only respond to PENDING requests
        if (connection.status !== "PENDING") {
            return res.status(409).json({
                error: `Request is already ${connection.status.toLowerCase()}`,
            });
        }

        const updated = await prisma.connection.update({
            where: { id: connectionId as string },
            data: { status: action },
            select: {
                id: true,
                status: true,
                updatedAt: true,
                sender: { select: { id: true, username: true, avatarUrl: true } },
            },
        });

        return res.status(200).json({
            message: `Connection request ${action.toLowerCase()}`,
            connection: updated,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────────────────────────
// DELETE /api/v1/connection/:connectionId
// Either the sender OR receiver can remove/withdraw a connection.
// ─────────────────────────────────────────────────────────────────
export async function removeConnection(req: Request, res: Response) {
    const userId = req.session.user.id;
    const { connectionId } = req.params;

    try {
        const connection = await prisma.connection.findUnique({
            where: { id: connectionId as string },
        });

        if (!connection) {
            return res.status(404).json({ error: "Connection not found" });
        }

        // Guard: only the two parties can remove a connection
        if (connection.senderId !== userId && connection.receiverId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await prisma.connection.delete({ where: { id: connectionId as string } });

        return res.status(200).json({ message: "Connection removed" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────────────────────────
// GET /api/v1/connection/my-connections
// Returns all ACCEPTED connections for the logged-in user,
// along with a total count — mirrors LinkedIn's "connections" tab
// ─────────────────────────────────────────────────────────────────
export async function getMyConnections(req: Request, res: Response) {
    const userId = req.session.user.id;

    try {
        // Fetch all ACCEPTED connections where this user is either sender or receiver
        const connections = await prisma.connection.findMany({
            where: {
                status: "ACCEPTED",
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
            select: {
                id: true,
                createdAt: true,
                // Conditionally return the "other" user's info
                sender: { select: { id: true, username: true, avatarUrl: true, organizations: true } },
                receiver: { select: { id: true, username: true, avatarUrl: true, organizations: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Flatten: return only the "other" person, not yourself
        const connectedUsers = connections.map((c) => ({
            connectionId: c.id,
            connectedAt: c.createdAt,
            user: c.sender.id === userId ? c.receiver : c.sender,
        }));

        return res.status(200).json({
            count: connectedUsers.length,
            connections: connectedUsers,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────────────────────────
// GET /api/v1/connection/pending
// Returns all incoming PENDING connection requests for the logged-in user
// (requests sent TO them, not BY them)
// ─────────────────────────────────────────────────────────────────
export async function getPendingRequests(req: Request, res: Response) {
    const userId = req.session.user.id;

    try {
        const pending = await prisma.connection.findMany({
            where: {
                receiverId: userId,
                status: "PENDING",
            },
            select: {
                id: true,
                createdAt: true,
                sender: { select: { id: true, username: true, avatarUrl: true, organizations: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ count: pending.length, requests: pending });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
