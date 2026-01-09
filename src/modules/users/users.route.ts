/**
 * Route definition for the users module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRoute } from "@hono/zod-openapi";
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
import { createUserSchema, dataUserSchema, paramsUserSchema, updateUserSchema } from "@/modules/users/users.validation";

const tags = ["Users"];

/**
 * Index Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const index = createRoute({
    path: "/api/v1/users",
    method: "get",
    tags,
    summary: "Get All Users Endpoint",
    description: "Endpoint for getting all users.",
    middleware: [authMiddleware, requirePermission("user.read")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        query: paramsUserSchema,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(RESPONSE_DATA_WITH_PAGINATION(dataUserSchema), HttpStatusPhrases.OK),
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
 * Store Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const store = createRoute({
    path: "/api/v1/users",
    method: "post",
    tags,
    summary: "Create User Endpoint",
    description: "Endpoint for creating a new user.",
    middleware: [authMiddleware, requirePermission("user.create")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        body: jsonContentRequired(createUserSchema, "User data to create"),
    },
    responses: {
        [HttpStatusCodes.CREATED]: jsonContent(dataUserSchema, HttpStatusPhrases.CREATED),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(createUserSchema), "Validation error(s)"),
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
    path: "/api/v1/users/{id}",
    method: "put",
    tags,
    summary: "Update User Endpoint",
    description: "Endpoint for updating a user.",
    middleware: [authMiddleware, requirePermission("user.update")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
        body: jsonContentRequired(updateUserSchema, "User data to update"),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(dataUserSchema, HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.FORBIDDEN]: jsonContent(FORBIDDEN_SCHEMA, "Access denied"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(NOT_FOUND_SCHEMA, HttpStatusPhrases.NOT_FOUND),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(updateUserSchema), "Validation error(s)"),
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
    path: "/api/v1/users/{id}",
    method: "get",
    tags,
    summary: "User Detail Endpoint",
    description: "Endpoint for getting user details.",
    middleware: [authMiddleware, requirePermission("user.show")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(dataUserSchema, HttpStatusPhrases.OK),
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
    path: "/api/v1/users/{id}",
    method: "delete",
    tags,
    summary: "User Delete Endpoint",
    description: "Endpoint for deleting a user.",
    middleware: [authMiddleware, requirePermission("user.destroy")] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    request: {
        params: ID_PARAMS_SCHEMA,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema("User deleted successfully"), HttpStatusPhrases.OK),
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

export type indexRoute = typeof index;
export type storeRoute = typeof store;
export type updateRoute = typeof update;
export type showRoute = typeof show;
export type destroyRoute = typeof destroy;
