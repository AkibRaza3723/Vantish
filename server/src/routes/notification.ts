import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "../controller/notification.controller.js";

const notificationRouter = Router();

notificationRouter.get("/", requireAuth, getNotifications);
notificationRouter.get("/unread-count", requireAuth, getUnreadCount);
notificationRouter.patch("/read-all", requireAuth, markAllAsRead);
notificationRouter.patch("/:id/read", requireAuth, markAsRead);

export default notificationRouter;
