/**
 * Main entry point of the application.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { connectDb, disconnectDb } from "@prisma/db";
import app from "@/application/app";
import env from "@/application/env";
import { logger } from "@/application/logging";
import { closeRedis, initRedis } from "@/application/redis";

const port = env.PORT;

/**
 * Initialize application services
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {*}
 */
async function initializeServices() {
    try {
        // Connect to database
        await connectDb();

        // Initialize Redis
        await initRedis();

        logger.info({ tag: "APP", message: `Server is running on port ${port}` });
    } catch (error) {
        logger.error({
            tag: "APP",
            message: "Failed to initialize services",
            error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
    }
}

/**
 * Graceful shutdown handler
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} signal
 *
 * @returns {*}
 */
async function gracefulShutdown(signal: string) {
    logger.info({
        tag: "APP",
        message: `${signal} received, shutting down gracefully...`,
    });

    try {
        // Close Redis connection
        await closeRedis();

        // Disconnect from database
        await disconnectDb();

        logger.info({ tag: "APP", message: "All connections closed. Exiting..." });
        process.exit(0);
    } catch (error) {
        logger.error({
            tag: "APP",
            message: "Error during shutdown",
            error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
    }
}

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Initialize services on startup
initializeServices();

export default {
    port,
    fetch: app.fetch,
};
