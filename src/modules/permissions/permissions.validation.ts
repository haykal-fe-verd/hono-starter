/**
 * Validation schemas for the permissions module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { z } from "@hono/zod-openapi";

// Params schema - for URL parameters
export const paramsPermissionSchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    per_page: z.coerce.number().int().positive().max(100).default(10).optional(),
    sort: z.enum(["name", "created_at", "updated_at"]).default("created_at").optional(),
    order: z.enum(["asc", "desc"]).default("desc").optional(),
});

export type ParamsPermissionSchema = z.infer<typeof paramsPermissionSchema>;

// Data schema - for response
export const dataPermissionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    roles_count: z.number().int().nonnegative().default(0).optional(),
    users_count: z.number().int().nonnegative().default(0).optional(),
});

export type DataPermissionSchema = z.infer<typeof dataPermissionSchema>;

// Create permission schema
export const createPermissionSchema = z.object({
    name: z
        .string()
        .min(3)
        .max(100)
        .regex(/^[a-z][a-z0-9._]*$/, {
            message:
                "Permission name must start with lowercase letter and contain only lowercase letters, numbers, dots, and underscores",
        })
        .openapi({
            example: "posts.create",
            description: "Permission name in lowercase with dots or underscores",
        }),
    description: z.string().min(3).max(255).nullable().optional().openapi({
        example: "Permission to create posts",
    }),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;

// Update permission schema
export const updatePermissionSchema = createPermissionSchema.partial();

export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;

// Assign permission to user schema
export const assignPermissionToUserSchema = z.object({
    user_id: z.string().uuid().openapi({
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
});

export type AssignPermissionToUserInput = z.infer<typeof assignPermissionToUserSchema>;
