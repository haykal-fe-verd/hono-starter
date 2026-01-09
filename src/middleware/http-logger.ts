/**
 * HTTP Logger Middleware
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import type { Context, Next } from "hono";
import env from "@/application/env";
import { logger, maskSensitive } from "@/application/logging";

/**
 * Http Logger for debug
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @async
 * @param {Context} c
 * @param {Next} next
 *
 * @returns {*}
 */
export const httpLogger = async (c: Context, next: Next) => {
	// Set logger to context so it can be accessed in routes
	c.set("logger", logger);

	// Only log when LOG_LEVEL is debug
	if (env.LOG_LEVEL !== "debug") {
		await next();
		return;
	}

	const start = Date.now();
	const { method, url } = c.req;
	const path = new URL(url).pathname;
	const query = new URL(url).search;

	// Get request headers (masked)
	const headers = Object.fromEntries(c.req.raw.headers.entries());
	const maskedHeaders = maskSensitive(headers);

	// Get user info
	const userAgent = c.req.header("user-agent") || "unknown";
	const ip =
		c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";

	// Log incoming request
	logger.http(`→ ${method} ${path}${query}`, {
		method,
		path,
		query: query || undefined,
		headers: maskedHeaders,
		userAgent,
		ip,
	});

	await next();

	// Calculate response time
	const duration = Date.now() - start;
	const status = c.res.status;

	// Determine log level based on status code
	const logLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "http";

	// Log response
	logger[logLevel](`← ${method} ${path}${query} ${status} ${duration}ms`, {
		method,
		path,
		status,
		duration: `${duration}ms`,
		userAgent,
		ip,
	});
};
