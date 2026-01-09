/**
 * Route definitions for the permissions module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";
import {
    createPermissionSchema,
    dataPermissionSchema,
    paramsPermissionSchema,
    updatePermissionSchema,
} from "@/modules/permissions/permissions.validation";

const tags = ["Permissions"];

/**
 * Index Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const index = createRoute({
    path: "/api/permissions",
    method: "get",
    tags,
    summary: "Get all permissions",
    request: {
        query: paramsPermissionSchema,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(dataPermissionSchema),
                meta: z.object({
                    total: z.number(),
                    page: z.number(),
                    per_page: z.number(),
                    total_page: z.number(),
                    has_next_page: z.boolean(),
                    has_prev_page: z.boolean(),
                }),
            }),
            "Permissions retrieved successfully"
        ),
    },
});

/**
 * Store Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const store = createRoute({
    path: "/api/permissions",
    method: "post",
    tags,
    summary: "Create new permission",
    request: {
        body: jsonContentRequired(createPermissionSchema, "Permission data"),
    },
    responses: {
        [HttpStatusCodes.CREATED]: jsonContent(
            z.object({
                success: z.boolean(),
                message: z.string(),
                data: dataPermissionSchema,
            }),
            "Permission created successfully"
        ),
        [HttpStatusCodes.CONFLICT]: jsonContent(
            createMessageObjectSchema("Permission name already exists"),
            "Permission already exists"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(createPermissionSchema),
            "Validation error"
        ),
    },
});

/**
 * Show Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const show = createRoute({
    path: "/api/permissions/:id",
    method: "get",
    tags,
    summary: "Get permission by ID",
    request: {
        params: z.object({
            id: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "id",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174000",
                }),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                success: z.boolean(),
                message: z.string(),
                data: dataPermissionSchema,
            }),
            "Permission retrieved successfully"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            createMessageObjectSchema("Permission not found"),
            "Permission not found"
        ),
    },
});
/**
 * Update Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const update = createRoute({
    path: "/api/permissions/:id",
    method: "put",
    tags,
    summary: "Update permission",
    request: {
        params: z.object({
            id: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "id",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174000",
                }),
        }),
        body: jsonContentRequired(updatePermissionSchema, "Permission data"),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                success: z.boolean(),
                message: z.string(),
                data: dataPermissionSchema,
            }),
            "Permission updated successfully"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            createMessageObjectSchema("Permission not found"),
            "Permission not found"
        ),
        [HttpStatusCodes.CONFLICT]: jsonContent(
            createMessageObjectSchema("Permission name already exists"),
            "Permission name already exists"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(updatePermissionSchema),
            "Validation error"
        ),
    },
});

/**
 * Destroy Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const destroy = createRoute({
    path: "/api/permissions/:id",
    method: "delete",
    tags,
    summary: "Delete permission",
    request: {
        params: z.object({
            id: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "id",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174000",
                }),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            createMessageObjectSchema("Permission deleted successfully"),
            "Permission deleted successfully"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            createMessageObjectSchema("Permission not found"),
            "Permission not found"
        ),
    },
});

/**
 * Get Roles By Permission Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const getRolesByPermission = createRoute({
    path: "/api/permissions/:id/roles",
    method: "get",
    tags,
    summary: "Get roles that have this permission",
    request: {
        params: z.object({
            id: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "id",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174000",
                }),
        }),
        query: z.object({
            page: z.coerce.number().int().positive().default(1).optional(),
            per_page: z.coerce.number().int().positive().max(100).default(10).optional(),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        description: z.string().nullable(),
                        created_at: z.string(),
                        updated_at: z.string(),
                    })
                ),
                meta: z.object({
                    total: z.number(),
                    page: z.number(),
                    per_page: z.number(),
                    total_page: z.number(),
                    has_next_page: z.boolean(),
                    has_prev_page: z.boolean(),
                }),
            }),
            "Roles retrieved successfully"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            createMessageObjectSchema("Permission not found"),
            "Permission not found"
        ),
    },
});

/**
 * Get Users By Permission Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const getUsersByPermission = createRoute({
    path: "/api/permissions/:id/users",
    method: "get",
    tags,
    summary: "Get users that have this permission directly",
    request: {
        params: z.object({
            id: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "id",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174000",
                }),
        }),
        query: z.object({
            page: z.coerce.number().int().positive().default(1).optional(),
            per_page: z.coerce.number().int().positive().max(100).default(10).optional(),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        email: z.string(),
                        email_verified_at: z.string().nullable(),
                        avatar: z.string().nullable(),
                        created_at: z.string(),
                        updated_at: z.string(),
                    })
                ),
                meta: z.object({
                    total: z.number(),
                    page: z.number(),
                    per_page: z.number(),
                    total_page: z.number(),
                    has_next_page: z.boolean(),
                    has_prev_page: z.boolean(),
                }),
            }),
            "Users retrieved successfully"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            createMessageObjectSchema("Permission not found"),
            "Permission not found"
        ),
    },
});

/**
 * Assign Permission To User Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const assignPermissionToUser = createRoute({
    path: "/api/permissions/:id/users/:userId",
    method: "post",
    tags,
    summary: "Assign permission directly to user",
    request: {
        params: z.object({
            id: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "id",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174000",
                }),
            userId: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "userId",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174001",
                }),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.object({
                    id: z.string(),
                    user: z.object({
                        id: z.string(),
                        name: z.string(),
                        email: z.string(),
                    }),
                    permission: z.object({
                        id: z.string(),
                        name: z.string(),
                        description: z.string().nullable(),
                    }),
                }),
            }),
            "Permission assigned to user successfully"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            createMessageObjectSchema("Permission not found"),
            "Permission not found"
        ),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            createMessageObjectSchema("Failed to assign permission to user"),
            "Assignment failed"
        ),
    },
});

/**
 * Remove Permission From User Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const removePermissionFromUser = createRoute({
    path: "/api/permissions/:id/users/:userId",
    method: "delete",
    tags,
    summary: "Remove permission from user",
    request: {
        params: z.object({
            id: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "id",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174000",
                }),
            userId: z
                .string()
                .uuid()
                .openapi({
                    param: {
                        name: "userId",
                        in: "path",
                    },
                    example: "123e4567-e89b-12d3-a456-426614174001",
                }),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            createMessageObjectSchema("Permission removed from user successfully"),
            "Permission removed successfully"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            createMessageObjectSchema("Permission not found"),
            "Permission not found"
        ),
    },
});

export type GetPermissionsRoute = typeof index;
export type CreatePermissionRoute = typeof store;
export type GetPermissionByIdRoute = typeof show;
export type UpdatePermissionRoute = typeof update;
export type DeletePermissionRoute = typeof destroy;
export type GetRolesByPermissionRoute = typeof getRolesByPermission;
export type GetUsersByPermissionRoute = typeof getUsersByPermission;
export type AssignPermissionToUserRoute = typeof assignPermissionToUser;
export type RemovePermissionFromUserRoute = typeof removePermissionFromUser;
