/**
 * Validation schemas for the roles module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { z } from "@hono/zod-openapi";

export const paramsRoleSchema = z
    .object({
        search: z
            .string()
            .optional()
            .openapi({ description: "Search term for filtering roles by name or description", example: "admin" }),
        page: z.coerce.number().min(1).default(1).openapi({ description: "Page number for pagination", example: 1 }),
        per_page: z.coerce
            .number()
            .min(1)
            .max(100)
            .default(10)
            .openapi({ description: "Number of roles per page", example: 10 }),
        sort: z
            .enum(["name", "created_at"])
            .default("created_at")
            .openapi({ description: "Field to sort roles by", example: "created_at" }),
        order: z.enum(["asc", "desc"]).default("desc").openapi({ description: "Sort order", example: "desc" }),
    })
    .openapi({ description: "Parameters for querying roles" });

export const dataRoleSchema = z
    .object({
        id: z
            .string()
            .uuid()
            .openapi({ description: "Unique identifier of the role", example: "550e8400-e29b-41d4-a716-446655440000" }),
        name: z.string().openapi({ description: "Name of the role", example: "admin" }),
        description: z
            .string()
            .nullable()
            .openapi({ description: "Description of the role", example: "Administrator role" }),
        permissions: z
            .array(
                z.object({
                    id: z.string().uuid().openapi({ description: "Permission ID" }),
                    name: z.string().openapi({ description: "Permission name", example: "user.create" }),
                    description: z
                        .string()
                        .nullable()
                        .openapi({ description: "Permission description", example: "Create users" }),
                })
            )
            .openapi({ description: "Role permissions" }),
        users_count: z.number().openapi({ description: "Number of users with this role", example: 5 }),
        created_at: z.string().openapi({ description: "Role creation timestamp", example: "2023-10-01T12:34:56Z" }),
        updated_at: z.string().openapi({ description: "Last role update timestamp", example: "2023-10-10T08:21:45Z" }),
    })
    .openapi({ description: "Role data schema" });

export const createRoleSchema = z
    .object({
        name: z
            .string()
            .min(2)
            .max(100)
            .openapi({ description: "Name of the role", example: "moderator" })
            .regex(/^[a-z_]+$/, "Role name must be lowercase and contain only letters and underscores"),
        description: z
            .string()
            .max(255)
            .optional()
            .openapi({ description: "Description of the role", example: "Moderator role with limited permissions" }),
    })
    .openapi({ description: "Schema for creating a new role" });

export const updateRoleSchema = z
    .object({
        name: z
            .string()
            .min(2)
            .max(100)
            .regex(/^[a-z_]+$/, "Role name must be lowercase and contain only letters and underscores")
            .optional()
            .openapi({ description: "Name of the role", example: "moderator" }),
        description: z
            .string()
            .max(255)
            .optional()
            .openapi({ description: "Description of the role", example: "Moderator role with limited permissions" }),
    })
    .openapi({ description: "Schema for updating an existing role" });

export const assignRoleSchema = z
    .object({
        user_id: z
            .string()
            .uuid()
            .openapi({ description: "User ID to assign the role to", example: "550e8400-e29b-41d4-a716-446655440000" }),
    })
    .openapi({ description: "Schema for assigning a role to a user" });

export const assignPermissionSchema = z
    .object({
        permission_id: z.string().uuid().openapi({
            description: "Permission ID to assign to the role",
            example: "550e8400-e29b-41d4-a716-446655440000",
        }),
    })
    .openapi({ description: "Schema for assigning a permission to a role" });

//! ========== Types ==========
export type ParamsRoleSchema = z.infer<typeof paramsRoleSchema>;
export type DataRoleSchema = z.infer<typeof dataRoleSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>;
