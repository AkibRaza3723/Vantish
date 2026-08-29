import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    completeProfile,
    getMyProfile,
    getUserById,
    updateMyProfile,
    deleteMyAccount,
} from "../controller/user.controller.js";

const userRouter = Router();

// ── Public routes ─────────────────────────────────────────────────
// Anyone can view a user's profile by their ID
userRouter.get("/:userId", getUserById);

// ── Protected routes (login required) ────────────────────────────
// POST  /api/v1/user/complete-profile  — called once after signup
userRouter.post("/complete-profile", requireAuth, completeProfile);

// GET   /api/v1/user/me                — get own profile
userRouter.get("/me", requireAuth, getMyProfile);

// PATCH /api/v1/user/me/profile        — partial update own profile
userRouter.patch("/me/profile", requireAuth, updateMyProfile);

// DELETE /api/v1/user/me               — delete own account
userRouter.delete("/me", requireAuth, deleteMyAccount);

export default userRouter;
