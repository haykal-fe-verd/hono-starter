/**
 * Redis Module
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createClient } from "redis";
import env from "@/application/env";
import { logger } from "@/application/logging";

export type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;

/**
 * Initialize Redis client
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {Promise<RedisClient>}
 */
export async function initRedis(): Promise<RedisClient> {
    if (redisClient) {
        return redisClient;
    }

    redisClient = createClient({
        url: env.REDIS_URL,
    });

    redisClient.on("error", (err: Error) => {
        logger.error({ tag: "REDIS", message: "Redis Error", error: err });
    });

    redisClient.on("connect", () => {
        logger.info({ tag: "REDIS", message: "Connecting to redis..." });
    });

    redisClient.on("ready", () => {
        logger.info({ tag: "REDIS", message: "Redis connected successfully" });
    });

    redisClient.on("reconnecting", () => {
        logger.warn({ tag: "REDIS", message: "Redis reconnecting..." });
    });

    redisClient.on("end", () => {
        logger.info({ tag: "REDIS", message: "Redis disconnected" });
    });

    await redisClient.connect();

    return redisClient;
}

/**
 * Get Redis client instance
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {RedisClient}
 */
export function getRedis(): RedisClient {
    if (!redisClient) {
        throw new Error("Redis client not initialized. Call initRedis() first.");
    }
    return redisClient;
}

/**
 * Close Redis connection
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {Promise<void>}
 */
export async function closeRedis(): Promise<void> {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger.info({ tag: "REDIS", message: "Redis connection closed" });
    }
}
