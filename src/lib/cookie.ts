/**
 * This is the Cookie Helper Module
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import type { Context } from "hono";
import { deleteCookie, getCookie, getSignedCookie, setCookie, setSignedCookie } from "hono/cookie";
import env from "@/application/env";

export interface CookieOptions {
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    expires?: Date;
}

/**
 * Default cookie options for the application
 */
const defaultCookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "Lax",
};

/**
 * Sets a cookie with default options
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Context} c - Hono context
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 *
 * @param {CookieOptions} options - Additional cookie options
 */
export function setAppCookie(c: Context, name: string, value: string, options?: CookieOptions): void {
    setCookie(c, name, value, {
        ...defaultCookieOptions,
        ...options,
    });
}

/**
 * Sets a signed cookie with default options
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Context} c - Hono context
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {string} secret - Secret for signing
 *
 * @param {CookieOptions} options - Additional cookie options
 */
export async function setAppSignedCookie(
    c: Context,
    name: string,
    value: string,
    secret: string,
    options?: CookieOptions
): Promise<void> {
    await setSignedCookie(c, name, value, secret, {
        ...defaultCookieOptions,
        ...options,
    });
}

/**
 * Gets a cookie value
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Context} c - Hono context
 * @param {string} name - Cookie name
 *
 * @returns {string | undefined}
 */
export function getAppCookie(c: Context, name: string): string | undefined {
    return getCookie(c, name);
}

/**
 * Gets a signed cookie value
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Context} c - Hono context
 * @param {string} name - Cookie name
 * @param {string} secret - Secret for verification
 *
 * @returns {Promise<string | false | undefined>}
 */
export async function getAppSignedCookie(
    c: Context,
    name: string,
    secret: string
): Promise<string | false | undefined> {
    return await getSignedCookie(c, name, secret);
}

/**
 * Deletes a cookie
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Context} c - Hono context
 * @param {string} name - Cookie name
 *
 * @param {Pick<CookieOptions, 'path' | 'domain'>} options - Cookie path and domain
 */
export function deleteAppCookie(c: Context, name: string, options?: Pick<CookieOptions, "path" | "domain">): void {
    deleteCookie(c, name, {
        path: options?.path || "/",
        domain: options?.domain,
    });
}
