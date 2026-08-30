import type { Request, Response } from "express";
import prisma from "../lib/db/dbConnect.js";

export async function getNotifications(req: Request, res: Response) {
    const userId = req.session.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            select: {
                id: true,
                type: true,
                message: true,
                isRead: true,
                createdAt: true,
                postId: true,
                commentId: true,
                connectionId: true,
                actor: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        const total = await prisma.notification.count({ where: { userId } });

        return res.status(200).json({
            notifications,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("getNotifications error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getUnreadCount(req: Request, res: Response) {
    const userId = req.session.user.id;
    try {
        const count = await prisma.notification.count({
            where: { userId, isRead: false }
        });
        return res.status(200).json({ count });
    } catch (error) {
        console.error("getUnreadCount error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function markAsRead(req: Request, res: Response) {
    const userId = req.session.user.id;
    const notificationId = String(req.params.id);

    try {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        });

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        if (notification.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const updated = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });

        return res.status(200).json({ message: "Notification marked as read", notification: updated });
    } catch (error) {
        console.error("markAsRead error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function markAllAsRead(req: Request, res: Response) {
    const userId = req.session.user.id;
    try {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("markAllAsRead error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
