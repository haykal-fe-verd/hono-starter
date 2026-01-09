/**
 * Validation schemas for the health module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { z } from "@hono/zod-openapi";

//! ========== Data Schemas ==========
export const healthDataSchema = z.object({
    status: z.string().openapi({ description: "Health status of the service", example: "ok" }),
    uptime: z.number().openapi({ description: "Server uptime in seconds", example: 3600 }),
    timestamp: z
        .string()
        .datetime()
        .openapi({ description: "Current server timestamp", example: "2025-12-31T10:00:00Z" }),
});

//! ========== Types ==========
export type HealthData = z.infer<typeof healthDataSchema>;
