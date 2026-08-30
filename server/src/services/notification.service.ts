import prisma from "../lib/db/dbConnect.js";
import { NotificationType } from "../generated/prisma/enums.js";

interface CreateNotificationParams {
    userId: string;
    actorId?: string | null;
    type: NotificationType;
    message: string;
    postId?: string | null;
    commentId?: string | null;
    connectionId?: string | null;
}

export const notificationService = {
    create: async (params: CreateNotificationParams) => {
        // Prevent notifying a user of their own actions
        if (params.actorId && params.userId === params.actorId) {
            return null;
        }

        // Prevent creating duplicate pending notifications
        if (params.type === NotificationType.CONNECTION_REQUEST && params.connectionId) {
            const existing = await prisma.notification.findFirst({
                where: {
                    userId: params.userId,
                    actorId: params.actorId ?? null,
                    type: params.type,
                    connectionId: params.connectionId,
                },
            });
            if (existing) return existing;
        }

        // Create the notification
        return prisma.notification.create({
            data: {
                userId: params.userId,
                actorId: params.actorId ?? null,
                type: params.type,
                message: params.message,
                postId: params.postId ?? null,
                commentId: params.commentId ?? null,
                connectionId: params.connectionId ?? null,
            },
        });
    },

    deleteByConnectionId: async (connectionId: string) => {
        return prisma.notification.deleteMany({
            where: { connectionId },
        });
    },

    deleteByPostAndActorAndType: async (postId: string, actorId: string, type: NotificationType) => {
        return prisma.notification.deleteMany({
            where: { postId, actorId, type },
        });
    }
};
