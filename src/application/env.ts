/**
 * Environment Module
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import z from "zod";

const EnvSchema = z.object({
    // APP
    NODE_ENV: z.string().default("development"),
    PORT: z.coerce.number().default(8000),
    LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("info"),
    LOG_RETENTION: z.string().default("30d"),
    ALLOWED_ORIGINS: z.string(),

    // DATABASE
    DATABASE_URL: z.string(),

    // MAIL
    MAIL_HOST: z.string().default("localhost"),
    MAIL_PORT: z.coerce.number().default(1025),
    MAIL_SECURE: z.coerce.boolean().default(false),
    MAIL_USER: z.string().optional(),
    MAIL_PASSWORD: z.string().optional(),
    MAIL_FROM: z.string().default("bun@test.com"),

    // RATE LIMITER
    RATE_LIMITER_MAX_REQUESTS: z.coerce.number().default(100),
    RATE_LIMITER_WINDOW_MS: z.coerce.number().default(60000),

    // REDIS
    REDIS_URL: z.string().default("redis://localhost:6379"),

    // JWT
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.coerce.number().default(300000), // 5 minutes
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().default(604800000), // 7 days
});

export type env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    process.exit(1);
}

export default env as env;
