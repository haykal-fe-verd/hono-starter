/**
 * Authentication Middleware
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import type { Context, Next } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { verifyAccessToken } from "@/lib/utils";

/**
 * Authentication middleware to protect routes.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Context} c
 * @param {Next} next
 *
 * @returns {Promise<Response | void>}
 */
export async function authMiddleware(c: Context, next: Next) {
    const auth = c.req.header("Authorization");

    if (!auth?.startsWith("Bearer "))
        return c.json({ message: "Invalid or expired token" }, HttpStatusCodes.UNAUTHORIZED);

    const token = auth.split(" ")[1];

    try {
        const payload = await verifyAccessToken(token);

        c.set("jwtPayload", payload);

        await next();
    } catch {
        return c.json({ message: "Invalid or expired token" }, HttpStatusCodes.UNAUTHORIZED);
    }
}
