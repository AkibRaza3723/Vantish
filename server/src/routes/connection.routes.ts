import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    sendRequest,
    respondToRequest,
    removeConnection,
    getMyConnections,
    getPendingRequests,
} from "../controller/connection.controller.js";

const connectionRouter = Router();

// All connection routes require authentication
connectionRouter.use(requireAuth);

// ── GET /api/v1/connection/my-connections  — list all ACCEPTED connections + count
connectionRouter.get("/my-connections", getMyConnections);

// ── GET /api/v1/connection/pending         — list incoming PENDING requests
connectionRouter.get("/pending", getPendingRequests);

// ── POST /api/v1/connection/send/:receiverId  — send a connection request
connectionRouter.post("/send/:receiverId", sendRequest);

// ── PATCH /api/v1/connection/respond/:connectionId  — accept or reject
connectionRouter.patch("/respond/:connectionId", respondToRequest);

// ── DELETE /api/v1/connection/:connectionId  — withdraw or remove
connectionRouter.delete("/:connectionId", removeConnection);

export default connectionRouter;
