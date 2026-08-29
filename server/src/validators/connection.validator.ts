import { z } from "zod";

// ─────────────────────────────────────────────────────────────────
//  respondSchema — used by PATCH /connection/respond/:connectionId
//  The receiver sends { action: "ACCEPTED" } or { action: "REJECTED" }
//  senderId, receiverId come from DB; userId comes from session — no body needed for those
// ─────────────────────────────────────────────────────────────────
export const respondSchema = z.object({
    action: z.enum(["ACCEPTED", "REJECTED"], {
        error: "action must be either ACCEPTED or REJECTED",
    }),
});

export type RespondInput = z.infer<typeof respondSchema>;
