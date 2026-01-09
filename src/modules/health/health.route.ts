/**
 * Route definition for the health module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { INTERNAL_SERVER_ERROR_SCHEMA, TOO_MANY_REQUESTS_SCHEMA } from "@/lib/constants";
import { healthDataSchema } from "@/modules/health/health.validation";

const tags = ["Health"];

/**
 * Route definition for the health module.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 */
export const health = createRoute({
    path: "/api/v1/health",
    method: "get",
    tags,
    summary: "Health Check Endpoint",
    description: "Endpoint to check the health status of the application.",
    responses: {
        [HttpStatusCodes.OK]: jsonContent(healthDataSchema, "Health Check Successful"),
        [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(TOO_MANY_REQUESTS_SCHEMA, HttpStatusPhrases.TOO_MANY_REQUESTS),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            INTERNAL_SERVER_ERROR_SCHEMA,
            HttpStatusPhrases.INTERNAL_SERVER_ERROR
        ),
    },
});

export type healthRoute = typeof health;
