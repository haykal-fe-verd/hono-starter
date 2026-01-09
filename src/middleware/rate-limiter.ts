/**
 * Rate Limiter Middleware using Redis
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import type { Context, MiddlewareHandler, Next } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import env from "@/application/env";
import { getRedis } from "@/application/redis";

export interface RateLimitOptions {
    /**
     * Maximum number of requests allowed per window
     * @default 100
     */
    max?: number;

    /**
     * Time window in seconds
     * @default 60 (1 minute)
     */
    windowInSeconds?: number;

    /**
     * Custom key generator function
     * @default Uses IP address
     */
    keyGenerator?: (c: Context) => string;

    /**
     * Custom handler when rate limit is exceeded
     */
    handler?: (c: Context) => Response | Promise<Response>;

    /**
     * Skip rate limiting based on condition
     */
    skip?: (c: Context) => boolean | Promise<boolean>;
}

/**
 * Default key generator using IP address
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Context} c
 *
 * @returns {string}
 */
function defaultKeyGenerator(c: Context): string {
    const forwarded = c.req.header("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : c.req.header("x-real-ip") || "unknown";
    return `rate-limit:${ip}`;
}

/**
 * Default handler when rate limit is exceeded
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Context} c
 *
 * @returns {Response}
 */
function defaultHandler(c: Context): Response {
    return c.json(
        {
            message: "Too many requests, please try again later.",
        },
        HttpStatusCodes.TOO_MANY_REQUESTS
    );
}

/**
 * Rate limiter middleware
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {RateLimitOptions} options
 *
 * @returns {MiddlewareHandler}
 */
export function rateLimiter(options: RateLimitOptions = {}): MiddlewareHandler {
    const {
        max = env.RATE_LIMITER_MAX_REQUESTS,
        windowInSeconds = Math.floor(env.RATE_LIMITER_WINDOW_MS / 1000),
        keyGenerator = defaultKeyGenerator,
        handler = defaultHandler,
        skip,
    } = options;

    return async (c: Context, next: Next) => {
        // Skip rate limiting if condition is met
        if (skip && (await skip(c))) {
            return next();
        }

        const redis = getRedis();
        const key = keyGenerator(c);
        const now = Date.now();
        const windowStart = now - windowInSeconds * 1000;

        try {
            // Remove old entries outside the current window
            await redis.zRemRangeByScore(key, 0, windowStart);

            // Count requests in current window
            const requestCount = await redis.zCard(key);

            // Set response headers
            c.header("X-RateLimit-Limit", max.toString());
            c.header("X-RateLimit-Remaining", Math.max(0, max - requestCount - 1).toString());
            c.header("X-RateLimit-Reset", Math.ceil((now + windowInSeconds * 1000) / 1000).toString());

            // Check if limit exceeded
            if (requestCount >= max) {
                c.header("Retry-After", windowInSeconds.toString());
                return handler(c);
            }

            // Add current request with timestamp as score
            await redis.zAdd(key, {
                score: now,
                value: `${now}-${Math.random()}`,
            });

            // Set expiry for the key
            await redis.expire(key, windowInSeconds);

            return next();
        } catch (error) {
            // If Redis fails, log error and continue without rate limiting
            console.error("Rate limiter error:", error);
            return next();
        }
    };
}

/**
 * Preset: Strict rate limiter (10 requests per minute)
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {MiddlewareHandler}
 */
export function strictRateLimiter(): MiddlewareHandler {
    return rateLimiter({
        max: 10,
        windowInSeconds: 60,
    });
}

/**
 * Preset: Moderate rate limiter (60 requests per minute)
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {MiddlewareHandler}
 */
export function moderateRateLimiter(): MiddlewareHandler {
    return rateLimiter({
        max: 60,
        windowInSeconds: 60,
    });
}

/**
 * Preset: Lenient rate limiter (120 requests per minute)
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {MiddlewareHandler}
 */
export function lenientRateLimiter(): MiddlewareHandler {
    return rateLimiter({
        max: 120,
        windowInSeconds: 60,
    });
}

/**
 * Rate limiter by user ID (requires authentication)
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {RateLimitOptions} options
 *
 * @returns {MiddlewareHandler}
 */
export function rateLimiterByUser(options: RateLimitOptions = {}): MiddlewareHandler {
    return rateLimiter({
        ...options,
        keyGenerator: (c: Context) => {
            const user = c.get("user");
            return user ? `rate-limit:user:${user.sub}` : defaultKeyGenerator(c);
        },
    });
}

/**
 * Preset: Default global rate limiter from env config
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {MiddlewareHandler}
 */
export function globalRateLimiter(): MiddlewareHandler {
    return rateLimiter();
}
