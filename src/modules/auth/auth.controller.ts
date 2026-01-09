/**
 * Controller functions for the auth module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import type { loginRoute, logoutRoute, profileRoute, refreshRoute } from "@/modules/auth/auth.route";
import * as AuthService from "@/modules/auth/auth.service";

/**
 * Login Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const login: AppRouteHandler<loginRoute> = async (c) => {
    const payload = c.req.valid("json");

    const result = await AuthService.login(payload);

    return c.json(result, HttpStatusCodes.OK);
};

/** Refresh Token Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const refresh: AppRouteHandler<refreshRoute> = async (c) => {
    const payload = c.req.valid("json");

    const result = await AuthService.refresh(payload);

    return c.json(result, HttpStatusCodes.OK);
};

/** Logout Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const logout: AppRouteHandler<logoutRoute> = async (c) => {
    const jwtPayload = c.get("jwtPayload");

    await AuthService.logout(jwtPayload.sub);

    return c.json({ message: "Logout successful" }, HttpStatusCodes.OK);
};

/** Profile Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const profile: AppRouteHandler<profileRoute> = async (c) => {
    const jwtPayload = c.get("jwtPayload");

    const result = await AuthService.profile(jwtPayload.sub);

    return c.json(result, HttpStatusCodes.OK);
};
