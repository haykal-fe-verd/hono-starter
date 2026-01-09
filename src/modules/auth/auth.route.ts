/**
 * Route definition for the auth module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";
import { INTERNAL_SERVER_ERROR_SCHEMA, TOO_MANY_REQUESTS_SCHEMA, UNAUTHORIZED_SCHEMA } from "@/lib/constants";
import { authMiddleware } from "@/middleware/auth-middleware";
import {
    loginDataSchema,
    loginSchema,
    profileDataSchema,
    refreshDataSchema,
    refreshTokenSchema,
} from "@/modules/auth/auth.validation";

const tags = ["Auth"];

/**
 * Login Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const login = createRoute({
    path: "/api/v1/auth/login",
    method: "post",
    tags,
    summary: "User Login Endpoint",
    description: "Endpoint for user login.",
    request: {
        body: jsonContentRequired(loginSchema, "Login credentials"),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(loginDataSchema, HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
            createMessageObjectSchema("Invalid email or password"),
            "Invalid email or password"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(loginSchema), "Validation error(s)"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Refresh Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const refresh = createRoute({
    path: "/api/v1/auth/refresh",
    method: "post",
    tags,
    summary: "User Refresh Endpoint",
    description: "Endpoint for getting refresh token.",
    request: {
        body: jsonContentRequired(refreshTokenSchema, "Refresh token request"),
    },
    security: [
        {
            Bearer: [],
        },
    ],
    responses: {
        [HttpStatusCodes.OK]: jsonContent(refreshDataSchema, HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(refreshTokenSchema),
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
 * Logout Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const logout = createRoute({
    path: "/api/v1/auth/logout",
    method: "delete",
    tags,
    summary: "User Logout Endpoint",
    description: "Endpoint for user logout. Invalidates the current session on client side.",
    middleware: [authMiddleware] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    responses: {
        [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema("Logout successful"), HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("User not found"), "User not found"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

/**
 * Profile Route
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const profile = createRoute({
    path: "/api/v1/auth/profile",
    method: "get",
    tags,
    summary: "User Profile Endpoint",
    description: "Endpoint for getting user profile information.",
    middleware: [authMiddleware] as const,
    security: [
        {
            Bearer: [],
        },
    ],
    responses: {
        [HttpStatusCodes.OK]: jsonContent(profileDataSchema, HttpStatusPhrases.OK),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(UNAUTHORIZED_SCHEMA, "Invalid or expired token"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("User not found"), "User not found"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

export type loginRoute = typeof login;
export type refreshRoute = typeof refresh;
export type logoutRoute = typeof logout;
export type profileRoute = typeof profile;
