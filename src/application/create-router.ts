/**
 * Create Router Module
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "stoker/openapi";
import type { AppBindings } from "@/lib/types";

/**
 * Create Router OpenApi
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {OpenAPIHono<AppBindings>}
 */
export function createRouter() {
    return new OpenAPIHono<AppBindings>({
        strict: false,
        defaultHook,
    });
}
