/**
 * Utility functions.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { sign, verify } from "hono/jwt";
import env from "@/application/env";
import type { JwtPayload } from "@/lib/types";

/**
 * Calculates the sum of two numbers.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {number} a
 * @param {number} b
 *
 * @returns {number}
 */
export function sumNumber(a: number, b: number): number {
    return a + b;
}

/**
 * Converts kebab-case string to Title Case.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} str
 *
 * @returns {string}
 */
export function toTitleCase(str: string): string {
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Hashes a password using Bun's built-in password hasher.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} password
 *
 * @returns {Promise<string>}
 */
export async function hashPassword(password: string): Promise<string> {
    return await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
    });
}

/**
 * Verifies a password against a hash using Bun's built-in password verifier.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} password
 * @param {string} hash
 *
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
}

/**
 * Generates a JWT access token for a user.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id_user
 *
 * @returns {Promise<string>}
 */
export async function generateAccessToken(id_user: string): Promise<string> {
    return await sign(
        {
            sub: id_user,
            exp: Math.floor(Date.now() / 1000) + Number(env.JWT_EXPIRES_IN) / 1000,
        },
        env.JWT_SECRET
    );
}

/**
 * Generates a JWT refresh token for a user.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id_user
 *
 * @returns {Promise<string>}
 */
export async function generateRefreshToken(id_user: string): Promise<string> {
    return await sign(
        {
            sub: id_user,
            type: "refresh",
            exp: Math.floor(Date.now() / 1000) + Number(env.REFRESH_TOKEN_EXPIRES_IN) / 1000,
        },
        env.REFRESH_TOKEN_SECRET
    );
}

/**
 * Verifies a JWT access token.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} token
 *
 * @returns {Promise<JwtPayload | null>}
 */
export async function verifyAccessToken(token: string): Promise<JwtPayload | null> {
    try {
        const decode = await verify(token, env.JWT_SECRET);
        return decode as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Verifies a JWT refresh token.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} token
 *
 * @returns {Promise<JwtPayload | null>}
 */
export async function verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
        const decode = await verify(token, env.REFRESH_TOKEN_SECRET);
        if (decode.type !== "refresh") {
            return null;
        }
        return decode as JwtPayload;
    } catch {
        return null;
    }
}
