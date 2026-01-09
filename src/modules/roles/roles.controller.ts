/**
 * Controller functions for the roles module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/lib/types";
import type {
    assignPermissionRoute,
    assignRoleRoute,
    destroyRoute,
    indexRoute,
    removePermissionRoute,
    removeRoleRoute,
    showRoute,
    storeRoute,
    updateRoute,
    usersRoute,
} from "@/modules/roles/roles.route";
import * as RoleService from "@/modules/roles/roles.service";

/**
 * Index Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const index: AppRouteHandler<indexRoute> = async (c) => {
    const query = c.req.valid("query");

    const roles = await RoleService.getAll(query);

    return c.json(roles, HttpStatusCodes.OK);
};

/**
 * Store Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const store: AppRouteHandler<storeRoute> = async (c) => {
    const data = c.req.valid("json");

    const role = await RoleService.create(data);

    return c.json(role, HttpStatusCodes.CREATED);
};

/**
 * Update Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const update: AppRouteHandler<updateRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");

    const role = await RoleService.update(id, data);

    return c.json(role, HttpStatusCodes.OK);
};

/**
 * Show Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const show: AppRouteHandler<showRoute> = async (c) => {
    const { id } = c.req.valid("param");

    const role = await RoleService.findById(id);

    return c.json(role, HttpStatusCodes.OK);
};

/**
 * Destroy Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const destroy: AppRouteHandler<destroyRoute> = async (c) => {
    const { id } = c.req.valid("param");

    await RoleService.destroy(id);

    return c.json({ message: "Role deleted successfully" }, HttpStatusCodes.OK);
};

/**
 * Get Users by Role Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const getUsersByRole: AppRouteHandler<usersRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const query = c.req.valid("query");

    const users = await RoleService.getUsersByRoleId(id, { page: query.page, per_page: query.per_page });

    return c.json(users, HttpStatusCodes.OK);
};

/**
 * Assign Role to User Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const assignRole: AppRouteHandler<assignRoleRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const { user_id } = c.req.valid("json");

    const userRole = await RoleService.assignRoleToUser(user_id, id);

    return c.json(userRole, HttpStatusCodes.CREATED);
};

/**
 * Remove Role from User Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const removeRole: AppRouteHandler<removeRoleRoute> = async (c) => {
    const { id, user_id } = c.req.valid("param");

    await RoleService.removeRoleFromUser(user_id, id);

    return c.json({ message: "Role removed from user successfully" }, HttpStatusCodes.OK);
};

/**
 * Assign Permission to Role Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const assignPermission: AppRouteHandler<assignPermissionRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const { permission_id } = c.req.valid("json");

    const rolePermission = await RoleService.assignPermissionToRole(id, permission_id);

    return c.json(rolePermission, HttpStatusCodes.CREATED);
};

/**
 * Remove Permission from Role Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const removePermission: AppRouteHandler<removePermissionRoute> = async (c) => {
    const { id, permission_id } = c.req.valid("param");

    await RoleService.removePermissionFromRole(id, permission_id);

    return c.json({ message: "Permission removed from role successfully" }, HttpStatusCodes.OK);
};
