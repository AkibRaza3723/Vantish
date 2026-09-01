import { z } from "zod";

export const POST_CATEGORIES = [
    "EXPECTATION_VS_REALITY",
    "RED_FLAG",
    "BURNOUT_LOG",
    "COMPENSATION",
    "CULTURE",
    "Confession",
    "FailStory",
    "General",
] as const;

export const createPostSchema = z.object({
    content: z.string().min(1, "Content is required"),
    category: z.enum(POST_CATEGORIES),
    stressRating: z.coerce.number().min(1, "Stress rating is required").max(5, "Stress rating is required"),
});

export const updatePostSchema = z.object({
    content: z.string().min(1, "Content is required").optional(),
    category: z.enum(POST_CATEGORIES).optional(),
    stressRating: z.coerce.number().min(1, "Stress rating is required").max(5, "Stress rating is required").optional(),
});


export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;