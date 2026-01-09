/**
 * Validation schemas for the users module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { z } from "@hono/zod-openapi";

export const paramsUserSchema = z
    .object({
        search: z
            .string()
            .optional()
            .openapi({ description: "Search term for filtering users by name or email", example: "john" }),
        page: z.coerce.number().min(1).default(1).openapi({ description: "Page number for pagination", example: 1 }),
        per_page: z.coerce
            .number()
            .min(1)
            .max(100)
            .default(10)
            .openapi({ description: "Number of users per page", example: 10 }),
        sort: z
            .enum(["name", "email", "created_at"])
            .default("created_at")
            .openapi({ description: "Field to sort users by", example: "created_at" }),
        order: z.enum(["asc", "desc"]).default("desc").openapi({ description: "Sort order", example: "desc" }),
    })
    .openapi({ description: "Parameters for querying users" });

export const dataUserSchema = z
    .object({
        id: z
            .string()
            .uuid()
            .openapi({ description: "Unique identifier of the user", example: "550e8400-e29b-41d4-a716-446655440000" }),
        name: z.string().openapi({ description: "Full name of the user", example: "John Doe" }),
        email: z
            .string()
            .email()
            .openapi({ description: "Email address of the user", example: "john.doe@example.com" }),
        email_verified_at: z.string().nullable().openapi({
            description: "Timestamp when the email was verified",
            example: "2023-10-05T14:48:00Z",
        }),
        avatar: z.string().nullable().openapi({
            description: "URL of the user's avatar image",
            example: "https://example.com/avatars/johndoe.png",
        }),
        roles: z
            .array(
                z.object({
                    id: z.string().uuid().openapi({ description: "Role ID" }),
                    name: z.string().openapi({ description: "Role name", example: "admin" }),
                    description: z
                        .string()
                        .nullable()
                        .openapi({ description: "Role description", example: "Administrator role" }),
                })
            )
            .openapi({ description: "User roles" }),
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
            .openapi({ description: "User permissions (roles + direct permissions)" }),
        created_at: z.string().openapi({ description: "Account creation timestamp", example: "2023-10-01T12:34:56Z" }),
        updated_at: z
            .string()
            .openapi({ description: "Last account update timestamp", example: "2023-10-10T08:21:45Z" }),
    })
    .openapi({ description: "User data schema" });

export const createUserSchema = z
    .object({
        name: z.string().min(2).max(100).openapi({ description: "Name of the user", example: "John Doe" }),
        email: z
            .string()
            .email()
            .openapi({ description: "Email address of the user", example: "john.doe@example.com" }),
        password: z
            .string()
            .min(6)
            .openapi({ description: "Password for the user account", example: "StrongPassword123" }),
        avatar: z
            .string()
            .url()
            .optional()
            .openapi({ description: "URL of the user's avatar", example: "https://example.com/avatar.jpg" }),
    })
    .openapi({ description: "Schema for creating a new user" });

export const updateUserSchema = z
    .object({
        name: z.string().min(2).max(100).optional().openapi({ description: "Name of the user", example: "John Doe" }),
        email: z
            .string()
            .email()
            .optional()
            .openapi({ description: "Email address of the user", example: "john.doe@example.com" }),
        password: z
            .string()
            .min(6)
            .optional()
            .openapi({ description: "Password for the user account", example: "StrongPassword123" }),
        avatar: z
            .string()
            .url()
            .optional()
            .openapi({ description: "URL of the user's avatar", example: "https://example.com/avatar.jpg" }),
    })
    .openapi({ description: "Schema for updating an existing user" });

//! ========== Types ==========
export type ParamsUserSchema = z.infer<typeof paramsUserSchema>;
export type DataUserSchema = z.infer<typeof dataUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
