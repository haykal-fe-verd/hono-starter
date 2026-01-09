/**
 * Create App Module
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { createRouter } from "@/application/create-router";
import { httpLogger } from "@/middleware/http-logger";
import { globalRateLimiter } from "@/middleware/rate-limiter";

/**
 * Create App Instance
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @export
 * @returns {*}
 */
export function createApp() {
    const app = createRouter();

    // Register Bearer Security Scheme
    app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
        type: "http",
        scheme: "bearer",
    });

    // Pretty JSON Middleware
    app.use(prettyJSON());

    // Request ID Middleware
    app.use(requestId());

    // Serve Emoji Favicon
    app.use(serveEmojiFavicon("🔥"));

    // Use HTTP Logger Middleware
    app.use(httpLogger);

    // Global Rate Limiter (100 requests per minute)
    app.use("/api/*", globalRateLimiter());

    // Not Found Handler
    app.notFound(notFound);

    // Global Error Handler
    app.onError(onError);

    return app;
}
