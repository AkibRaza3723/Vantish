import type { Request, Response } from "express";
import prisma from "../lib/db/dbConnect.js";
import {
    completeProfileSchema,
    updateProfileSchema,
} from "../validators/user.validator.js";

// ─────────────────────────────────────────────────────────────────
// POST /api/v1/user/complete-profile
// Called after signup — collects role-specific details.
// If role==="student"  → expects: organizations, organization_type, course, bio, graduationYear, username
// If role==="employed" → expects: organizations, organization_type, course, bio, position, Experience, username
// ─────────────────────────────────────────────────────────────────
export async function completeProfile(req: Request, res: Response) {
    const userId = req.session.user.id;

    const parsed = completeProfileSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Validation failed",
            fieldErrors: parsed.error.flatten().fieldErrors,
        });
    }

    const data = parsed.data;

    try {
        // Check if username is already taken by another user
        if (data.username) {
            const existing = await prisma.user.findFirst({
                where: {
                    username: data.username,
                    NOT: { id: userId },
                },
            });

            if (existing) {
                return res.status(409).json({ error: "Username is already taken" });
            }
        }

        // Build the update payload — common fields first
        const updatePayload: Record<string, unknown> = {
            username: data.username,
            bio: data.bio ?? null,
            role: data.role,
            organizations: data.organizations,
            organization_type: data.organization_type,
            course: data.course,
        };

        // Attach role-specific fields
        if (data.role === "student") {
            updatePayload.GraduationYear = data.graduationYear;
        } else {
            // All employed roles
            updatePayload.position = data.position;
            updatePayload.Experience = data.Experience;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatePayload,
            select: {
                id: true,
                username: true,
                role: true,
                organizations: true,
                organization_type: true,
                course: true,
                bio: true,
                GraduationYear: true,
                position: true,
                Experience: true,
                createdAt: true,
            },
        });

        return res.status(200).json({
            message: "Profile completed successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────────────────────────
// GET /api/v1/user/me
// Returns the currently logged-in user's own profile
// ─────────────────────────────────────────────────────────────────
export async function getMyProfile(req: Request, res: Response) {
    const userId = req.session.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                role: true,
                organizations: true,
                organization_type: true,
                course: true,
                bio: true,
                GraduationYear: true,
                position: true,
                Experience: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { posts: true, comments: true },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────────────────────────
// GET /api/v1/user/:userId
// Returns any user's public profile by their ID
// ─────────────────────────────────────────────────────────────────
export async function getUserById(req: Request, res: Response) {
    const { userId } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId as string },
            select: {
                id: true,
                username: true,
                role: true,
                organizations: true,
                organization_type: true,
                course: true,
                bio: true,
                GraduationYear: true,
                position: true,
                Experience: true,
                createdAt: true,
                _count: {
                    select: { posts: true },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────────────────────────
// PATCH /api/v1/user/me/profile
// Partial update — role is still required to know which fields to allow
// ─────────────────────────────────────────────────────────────────
export async function updateMyProfile(req: Request, res: Response) {
    const userId = req.session.user.id;

    const parsed = updateProfileSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Validation failed",
            fieldErrors: parsed.error.flatten().fieldErrors,
        });
    }

    const data = parsed.data;

    try {
        // Check username uniqueness if they are changing it
        if (data.username) {
            const existing = await prisma.user.findFirst({
                where: {
                    username: data.username,
                    NOT: { id: userId },
                },
            });

            if (existing) {
                return res.status(409).json({ error: "Username is already taken" });
            }
        }

        const updatePayload: Record<string, unknown> = {};

        // Only include fields that were actually sent
        if (data.username)           updatePayload.username           = data.username;
        if (data.bio !== undefined)  updatePayload.bio                = data.bio;
        if (data.organizations)      updatePayload.organizations      = data.organizations;
        if (data.organization_type)  updatePayload.organization_type  = data.organization_type;
        if (data.course)             updatePayload.course             = data.course;

        if (data.role === "student") {
            if (data.graduationYear !== undefined) updatePayload.GraduationYear = data.graduationYear;
        } else {
            if (data.position !== undefined)    updatePayload.position   = data.position;
            if (data.Experience !== undefined)  updatePayload.Experience = data.Experience;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatePayload,
            select: {
                id: true,
                username: true,
                role: true,
                organizations: true,
                organization_type: true,
                course: true,
                bio: true,
                GraduationYear: true,
                position: true,
                Experience: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

// ─────────────────────────────────────────────────────────────────
// DELETE /api/v1/user/me
// Deletes the currently logged-in user's account (cascades in DB)
// ─────────────────────────────────────────────────────────────────
export async function deleteMyAccount(req: Request, res: Response) {
    const userId = req.session.user.id;

    try {
        await prisma.user.delete({ where: { id: userId } });

        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
