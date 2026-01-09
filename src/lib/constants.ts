/**
 * Constants for the application.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { z } from "@hono/zod-openapi";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const NOT_FOUND_SCHEMA = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);

export const INTERNAL_SERVER_ERROR_SCHEMA = createMessageObjectSchema(HttpStatusPhrases.INTERNAL_SERVER_ERROR);

export const TOO_MANY_REQUESTS_SCHEMA = createMessageObjectSchema("Too many requests, please try again later");

export const FORBIDDEN_SCHEMA = createMessageObjectSchema("Access denied");

export const UNAUTHORIZED_SCHEMA = createMessageObjectSchema("Invalid or expired token");

export const ID_PARAMS_SCHEMA = z.object({
    id: z.string().openapi({
        param: {
            name: "id",
            in: "path",
            required: true,
        },
        required: ["id"],
        example: "4651e634-a530-4484-9b09-9616a28f35e3",
    }),
});

export const EMAIL_PARAMS_SCHEMA = z.object({
    email: z
        .string()
        .email()
        .openapi({
            param: {
                name: "email",
                in: "path",
                required: true,
            },
            required: ["email"],
            example: "john.doe@example.com",
        }),
});

export const META_PAGINATION_SCHEMA = z.object({
    total: z.number().int().min(0).openapi({ example: 30 }),
    page: z.number().int().min(1).openapi({ example: 1 }),
    per_page: z.number().int().min(1).openapi({ example: 10 }),
    total_page: z.number().int().min(0).openapi({ example: 3 }),
    has_next_page: z.boolean().openapi({ example: true }),
    has_prev_page: z.boolean().openapi({ example: false }),
});

export const RESPONSE_DATA_WITH_PAGINATION = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        data: z.array(dataSchema),
        meta: META_PAGINATION_SCHEMA,
    });
