/**
 * Controller functions for the users module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import type { destroyRoute, indexRoute, showRoute, storeRoute, updateRoute } from "@/modules/users/users.route";
import * as UserService from "@/modules/users/users.service";

/**
 * Index Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const index: AppRouteHandler<indexRoute> = async (c) => {
    const query = c.req.valid("query");

    const users = await UserService.getAll(query);

    return c.json(users, HttpStatusCodes.OK);
};

/**
 * Store Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const store: AppRouteHandler<storeRoute> = async (c) => {
    const data = c.req.valid("json");

    const user = await UserService.create(data);

    return c.json(user, HttpStatusCodes.CREATED);
};

/**
 * Update Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const update: AppRouteHandler<updateRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");

    const user = await UserService.update(id, data);

    return c.json(user, HttpStatusCodes.OK);
};

/**
 * Show Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const show: AppRouteHandler<showRoute> = async (c) => {
    const { id } = c.req.valid("param");

    const user = await UserService.findById(id);

    return c.json(user, HttpStatusCodes.OK);
};

/**
 * Destroy Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const destroy: AppRouteHandler<destroyRoute> = async (c) => {
    const { id } = c.req.valid("param");

    await UserService.destroy(id);

    return c.json({ message: "User deleted successfully" }, HttpStatusCodes.OK);
};
