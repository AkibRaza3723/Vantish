import { z } from "zod";

export const createCommentSchema = z.object({
    postId: z.string().uuid("Invalid post ID"),
    content: z.string().min(1, "Content is required").max(1000, "Comment cannot exceed 1000 characters"),
});

export const updateCommentSchema = z.object({
    content: z.string().min(1, "Content is required").max(1000, "Comment cannot exceed 1000 characters"),
});

export const commentParamsSchema = z.object({
    id: z.string().uuid("Invalid comment ID"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentParams = z.infer<typeof commentParamsSchema>;