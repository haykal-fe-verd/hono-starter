/**
 * Database connection and Prisma client setup.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { PrismaPg } from "@prisma/adapter-pg";
import env from "@/application/env";
import { logger } from "@/application/logging";
import { PrismaClient } from "./generated/client";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({
    adapter,
    log: [
        {
            emit: "stdout",
            level: "query",
        },
        {
            emit: "stdout",
            level: "error",
        },
        {
            emit: "stdout",
            level: "info",
        },
        {
            emit: "stdout",
            level: "warn",
        },
    ],
});

prisma.$on("error", (e) => {
    logger.error(e);
});

prisma.$on("warn", (e) => {
    logger.warn(e);
});

prisma.$on("info", (e) => {
    logger.info(e);
});

prisma.$on("query", (e) => {
    logger.info(e);
});

/**
 * Connect to the database.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {*}
 */
const connectDb = async () => {
    try {
        logger.info({ tag: "DB", message: "Connecting to database..." });
        await prisma.$connect();
        logger.info({ tag: "DB", message: "Database connected successfully" });
    } catch (error) {
        logger.error("Database connection failed:", error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

/**
 * Disconnect from the database.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {*}
 */
const disconnectDb = async () => {
    await prisma.$disconnect();
};

export { prisma, connectDb, disconnectDb };
