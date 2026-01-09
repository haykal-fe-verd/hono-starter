/**
 * Route definition for the roles module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";
import {
    FORBIDDEN_SCHEMA,
    ID_PARAMS_SCHEMA,
    INTERNAL_SERVER_ERROR_SCHEMA,
    NOT_FOUND_SCHEMA,
    RESPONSE_DATA_WITH_PAGINATION,
    TOO_MANY_REQUESTS_SCHEMA,
    UNAUTHORIZED_SCHEMA,
} from "@/lib/constants";
import { authMiddleware } from "@/middleware/auth-middleware";
import { requirePermission } from "@/middleware/role-permission-middleware";
import {
    assignPermissionSchema,
    assignRoleSchema,
    createRoleSchema,
    dataRoleSchema,
    paramsRoleSchema,
    updateRoleSchema,
} from "@/modules/roles/roles.validation";
import { dataUserSchema, paramsUserSchema } from "@/modules/users/users.validation";

const tags = ["Roles"];

/**
 * Index Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const index = createRoute({
    path: "/api/v1/roles",
    method: "get",
    tags,
    summary: "Get All Roles Endpoint",
    description: "Endpoint for getting all roles.",
    middleware: [authMiddleware, requirePermission("role.read")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        query: paramsRoleSchema,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(RESPONSE_DATA_WITH_PAGINATION(dataRoleSchema), HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(paramsRoleSchema), "Validation error(s)"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Store Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const store = createRoute({
    path: "/api/v1/roles",
    method: "post",
    tags,
    summary: "Create Role Endpoint",
    description: "Endpoint for creating a new role.",
    middleware: [authMiddleware, requirePermission("role.create")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        body: jsonContentRequired(createRoleSchema, "Role data to create"),
    },
    responses: {
        [HttpStatusCodes.CREATED]: jsonContent(dataRoleSchema, HttpStatusPhrases.CREATED),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(createRoleSchema), "Validation error(s)"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Update Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const update = createRoute({
    path: "/api/v1/roles/{id}",
    method: "put",
    tags,
    summary: "Update Role Endpoint",
    description: "Endpoint for updating a role.",
    middleware: [authMiddleware, requirePermission("role.update")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
        body: jsonContentRequired(updateRoleSchema, "Role data to update"),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(dataRoleSchema, HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(updateRoleSchema), "Validation error(s)"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Show Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const show = createRoute({
    path: "/api/v1/roles/{id}",
    method: "get",
    tags,
    summary: "Role Detail Endpoint",
    description: "Endpoint for getting role details.",
    middleware: [authMiddleware, requirePermission("role.show")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(dataRoleSchema, HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(ID_PARAMS_SCHEMA), "Validation error(s)"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Destroy Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const destroy = createRoute({
    path: "/api/v1/roles/{id}",
    method: "delete",
    tags,
    summary: "Role Delete Endpoint",
    description: "Endpoint for deleting a role.",
    middleware: [authMiddleware, requirePermission("role.destroy")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema("Role deleted successfully"), HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(ID_PARAMS_SCHEMA), "Validation error(s)"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Get Users by Role Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const users = createRoute({
    path: "/api/v1/roles/{id}/users",
    method: "get",
    tags,
    summary: "Get Users by Role Endpoint",
    description: "Endpoint for getting all users assigned to a specific role.",
    middleware: [authMiddleware, requirePermission("role.read")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
        query: paramsUserSchema,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            RESPONSE_DATA_WITH_PAGINATION(
                dataUserSchema.omit({
                    roles: true,
                    permissions: true,
                })
            ),
            HttpStatusPhrases.OK
        ),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(paramsUserSchema), "Validation error(s)"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Assign Role to User Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const assignRole = createRoute({
    path: "/api/v1/roles/{id}/assign",
    method: "post",
    tags,
    summary: "Assign Role to User Endpoint",
    description: "Endpoint for assigning a role to a user.",
    middleware: [authMiddleware, requirePermission("role.assign")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
        body: jsonContentRequired(assignRoleSchema, "User ID to assign the role to"),
    },
    responses: {
        [HttpStatusCodes.CREATED]: jsonContent(
            z.object({
                id: z.string().uuid(),
                user: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    email: z.string().email(),
                }),
                role: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    description: z.string().nullable(),
                }),
            }),
            HttpStatusPhrases.CREATED
        ),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(assignRoleSchema), "Validation error(s)"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Remove Role from User Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const removeRole = createRoute({
    path: "/api/v1/roles/{id}/remove/{user_id}",
    method: "delete",
    tags,
    summary: "Remove Role from User Endpoint",
    description: "Endpoint for removing a role from a user.",
    middleware: [authMiddleware, requirePermission("role.assign")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: z.object({
            id: z.string().uuid().openapi({
                description: "Role ID",
                example: "550e8400-e29b-41d4-a716-446655440000",
            }),
            user_id: z.string().uuid().openapi({
                description: "User ID",
                example: "550e8400-e29b-41d4-a716-446655440000",
            }),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            createMessageObjectSchema("Role removed from user successfully"),
            HttpStatusPhrases.OK
        ),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Assign Permission to Role Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const assignPermission = createRoute({
    path: "/api/v1/roles/{id}/permissions",
    method: "post",
    tags,
    summary: "Assign Permission to Role Endpoint",
    description: "Endpoint for assigning a permission to a role.",
    middleware: [authMiddleware, requirePermission("role.update")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
        body: jsonContentRequired(assignPermissionSchema, "Permission ID to assign to the role"),
    },
    responses: {
        [HttpStatusCodes.CREATED]: jsonContent(
            z.object({
                id: z.string().uuid(),
                role: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    description: z.string().nullable(),
                }),
                permission: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    description: z.string().nullable(),
                }),
            }),
            HttpStatusPhrases.CREATED
        ),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(assignPermissionSchema),
            "Validation error(s)"
        ),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Remove Permission from Role Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const removePermission = createRoute({
    path: "/api/v1/roles/{id}/permissions/{permission_id}",
    method: "delete",
    tags,
    summary: "Remove Permission from Role Endpoint",
    description: "Endpoint for removing a permission from a role.",
    middleware: [authMiddleware, requirePermission("role.update")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: z.object({
            id: z.string().uuid().openapi({
                description: "Role ID",
                example: "550e8400-e29b-41d4-a716-446655440000",
            }),
            permission_id: z.string().uuid().openapi({
                description: "Permission ID",
                example: "550e8400-e29b-41d4-a716-446655440000",
            }),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            createMessageObjectSchema("Permission removed from role successfully"),
            HttpStatusPhrases.OK
        ),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

export type indexRoute = typeof index;
export type storeRoute = typeof store;
export type updateRoute = typeof update;
export type showRoute = typeof show;
export type destroyRoute = typeof destroy;
export type usersRoute = typeof users;
export type assignRoleRoute = typeof assignRole;
export type removeRoleRoute = typeof removeRole;
export type assignPermissionRoute = typeof assignPermission;
export type removePermissionRoute = typeof removePermission;
