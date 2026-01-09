/**
 * Validation schemas for the auth module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { z } from "@hono/zod-openapi";

export const loginSchema = z
    .object({
        email: z
            .string()
            .email()
            .openapi({ description: "Email address of the user", example: "john.doe@example.com" }),
        password: z
            .string()
            .min(6)
            .openapi({ description: "Password for the user account", example: "StrongPassword123" }),
    })
    .openapi({ description: "Schema for user login" });

export const loginDataSchema = z
    .object({
        user: z
            .object({
                id: z.string().uuid().openapi({
                    description: "Unique identifier of the user",
                    example: "550e8400-e29b-41d4-a716-446655440000",
                }),
                email: z
                    .string()
                    .email()
                    .openapi({ description: "Email address of the user", example: "john.doe@example.com" }),
                name: z.string().openapi({ description: "Full name of the user", example: "John Doe" }),
                email_verified_at: z.string().nullable().openapi({
                    description: "Timestamp when the email was verified",
                    example: "2023-10-05T14:48:00Z",
                }),
                avatar: z.string().nullable().openapi({
                    description: "URL of the user's avatar image",
                    example: "https://example.com/avatars/johndoe.png",
                }),
                created_at: z
                    .string()
                    .openapi({ description: "Account creation timestamp", example: "2023-10-01T12:34:56Z" }),
                updated_at: z
                    .string()
                    .openapi({ description: "Last account update timestamp", example: "2023-10-10T08:21:45Z" }),
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
            })
            .openapi({ description: "User information excluding sensitive data" }),
        access_token: z.string().openapi({
            description: "JWT access token for authentication",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        }),
        refresh_token: z.string().openapi({
            description: "JWT refresh token for obtaining new access tokens",
            example: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
        }),
    })
    .openapi({ description: "Response schema for user login" });

export const refreshTokenSchema = z
    .object({
        refresh_token: z.string().openapi({
            description: "JWT refresh token for obtaining new access tokens",
            example: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
        }),
    })
    .openapi({ description: "Schema for refresh token request" });

export const refreshDataSchema = z
    .object({
        access_token: z.string().openapi({
            description: "New JWT access token for authentication",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        }),
    })
    .openapi({ description: "Response schema for token refresh" });

export const profileDataSchema = loginDataSchema.shape.user;

//! ========== Types ==========
export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginDataSchema = z.infer<typeof loginDataSchema>;
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
export type RefreshDataSchema = z.infer<typeof refreshDataSchema>;
export type ProfileDataSchema = z.infer<typeof profileDataSchema>;
