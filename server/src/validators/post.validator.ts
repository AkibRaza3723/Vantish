import { z } from "zod";

export const createPostSchema = z.object({
    content: z.string().min(1, "Content is required"),
    category: z.enum(["EXPECTATION_VS_REALITY", "RED_FLAG", "BURNOUT_LOG", "COMPENSATION", "CULTURE"]),
    stressRating: z.number().min(1, "Stress rating is required").max(5, "Stress rating is required"),
});

export const updatePostSchema = z.object({
    content: z.string().min(1, "Content is required").optional(),
    category: z.enum(["EXPECTATION_VS_REALITY", "RED_FLAG", "BURNOUT_LOG", "COMPENSATION", "CULTURE"]).optional(),
    stressRating: z.number().min(1, "Stress rating is required").max(5, "Stress rating is required").optional(),
});


export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;