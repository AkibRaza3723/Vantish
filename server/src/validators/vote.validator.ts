import { z } from "zod";

// Validates the body when casting or changing a vote
export const castVoteSchema = z.object({
    voteType: z.enum(["RELATED", "NOT_RELATED"], {
        errorMap: () => ({ message: "voteType must be RELATED or NOT_RELATED" }),
    }),
});

export type CastVoteInput = z.infer<typeof castVoteSchema>;
