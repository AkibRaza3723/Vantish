import { z } from "zod";

// ─────────────────────────────────────────────────────────────────
//  Shared base fields — collected from ALL users regardless of role
// ─────────────────────────────────────────────────────────────────
const baseUserSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username cannot exceed 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),

    bio: z
        .string()
        .max(300, "Bio cannot exceed 300 characters")
        .optional(),

    organizations: z
        .string()
        .min(2, "Organization name must be at least 2 characters"),

    organization_type: z.enum(
        ["College", "University", "Startup", "MNC", "Agency", "Freelance", "Other"],
        { error: "Invalid organization type" }
    ),

    course: z
        .string()
        .min(2, "Course/field must be at least 2 characters"),
});

// ─────────────────────────────────────────────────────────────────
//  STUDENT-specific schema
//  Extra: graduationYear
//  Missing: position, Experience
// ─────────────────────────────────────────────────────────────────
export const studentProfileSchema = baseUserSchema.extend({
    role: z.literal("student"),

    graduationYear: z
        .number()
        .int()
        .min(2000, "Graduation year seems too old")
        .max(new Date().getFullYear() + 6, "Graduation year too far in future"),
});

// ─────────────────────────────────────────────────────────────────
//  EMPLOYED-specific schema
//  Extra: position, Experience
//  graduationYear is NOT collected
// ─────────────────────────────────────────────────────────────────
export const employedProfileSchema = baseUserSchema.extend({
    role: z.enum(["employed", "software_engineer", "product_manager", "designer", "other_employed"]),

    position: z
        .string()
        .min(2, "Position must be at least 2 characters")
        .max(100, "Position is too long"),

    Experience: z
        .number()
        .int()
        .min(0, "Experience cannot be negative")
        .max(60, "Experience seems unrealistically high"),
});

// ─────────────────────────────────────────────────────────────────
//  Combined schema using discriminatedUnion on "role"
//  Zod will automatically pick the right shape based on role value
// ─────────────────────────────────────────────────────────────────
export const completeProfileSchema = z.discriminatedUnion("role", [
    studentProfileSchema,
    employedProfileSchema,
]);

// ─────────────────────────────────────────────────────────────────
//  Update schema — everything optional except role for type-picking
//  Used by PATCH /me/profile
// ─────────────────────────────────────────────────────────────────
export const updateStudentSchema = studentProfileSchema.partial().required({ role: true });
export const updateEmployedSchema = employedProfileSchema.partial().required({ role: true });

export const updateProfileSchema = z.discriminatedUnion("role", [
    updateStudentSchema,
    updateEmployedSchema,
]);

// ─────────────────────────────────────────────────────────────────
//  TypeScript inferred types
// ─────────────────────────────────────────────────────────────────
export type StudentProfileInput  = z.infer<typeof studentProfileSchema>;
export type EmployedProfileInput = z.infer<typeof employedProfileSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type UpdateProfileInput   = z.infer<typeof updateProfileSchema>;
