/**
 * Controller functions for the permissions module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "@/lib/types";
import type {
    AssignPermissionToUserRoute,
    CreatePermissionRoute,
    DeletePermissionRoute,
    GetPermissionByIdRoute,
    GetPermissionsRoute,
    GetRolesByPermissionRoute,
    GetUsersByPermissionRoute,
    RemovePermissionFromUserRoute,
    UpdatePermissionRoute,
} from "@/modules/permissions/permissions.route";
import * as service from "@/modules/permissions/permissions.service";

/**
 * Index Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const index: AppRouteHandler<GetPermissionsRoute> = async (c) => {
    const query = c.req.valid("query");
    const result = await service.getAll(query);

    return c.json(
        {
            success: true,
            message: HttpStatusPhrases.OK,
            data: result.data,
            meta: result.meta,
        },
        HttpStatusCodes.OK
    );
};

/**
 * Store Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const store: AppRouteHandler<CreatePermissionRoute> = async (c) => {
    const body = c.req.valid("json");

    // Check if permission already exists
    const existingPermission = await service.findByName(body.name);
    if (existingPermission) {
        return c.json(
            {
                success: false,
                message: "Permission name already exists",
            },
            HttpStatusCodes.CONFLICT
        );
    }

    const permission = await service.create(body);

    return c.json(
        {
            success: true,
            message: "Permission created successfully",
            data: permission,
        },
        HttpStatusCodes.CREATED
    );
};

/**
 * Update Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const update: AppRouteHandler<UpdatePermissionRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    // Check if permission exists
    const existingPermission = await service.findById(id);
    if (!existingPermission) {
        return c.json(
            {
                success: false,
                message: "Permission not found",
            },
            HttpStatusCodes.NOT_FOUND
        );
    }

    // Check if new name already exists (if name is being changed)
    if (body.name && body.name !== existingPermission.name) {
        const nameExists = await service.findByName(body.name);
        if (nameExists) {
            return c.json(
                {
                    success: false,
                    message: "Permission name already exists",
                },
                HttpStatusCodes.CONFLICT
            );
        }
    }

    const permission = await service.update(id, body);

    return c.json(
        {
            success: true,
            message: "Permission updated successfully",
            data: permission,
        },
        HttpStatusCodes.OK
    );
};

/**
 * Show Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const show: AppRouteHandler<GetPermissionByIdRoute> = async (c) => {
    const { id } = c.req.valid("param");

    const permission = await service.findById(id);
    if (!permission) {
        return c.json(
            {
                success: false,
                message: "Permission not found",
            },
            HttpStatusCodes.NOT_FOUND
        );
    }

    return c.json(
        {
            success: true,
            message: HttpStatusPhrases.OK,
            data: permission,
        },
        HttpStatusCodes.OK
    );
};

/**
 * Destroy Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const destroy: AppRouteHandler<DeletePermissionRoute> = async (c) => {
    const { id } = c.req.valid("param");

    // Check if permission exists
    const existingPermission = await service.findById(id);
    if (!existingPermission) {
        return c.json(
            {
                success: false,
                message: "Permission not found",
            },
            HttpStatusCodes.NOT_FOUND
        );
    }

    await service.destroy(id);

    return c.json(
        {
            success: true,
            message: "Permission deleted successfully",
        },
        HttpStatusCodes.OK
    );
};

/**
 * Get roles by permission Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const getRolesByPermission: AppRouteHandler<GetRolesByPermissionRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const query = c.req.valid("query");

    // Check if permission exists
    const permission = await service.findById(id);
    if (!permission) {
        return c.json(
            {
                success: false,
                message: "Permission not found",
            },
            HttpStatusCodes.NOT_FOUND
        );
    }

    const result = await service.getRolesByPermissionId(id, query);

    return c.json(
        {
            success: true,
            message: HttpStatusPhrases.OK,
            data: result.data,
            meta: result.meta,
        },
        HttpStatusCodes.OK
    );
};

/**
 * Get users by permission Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const getUsersByPermission: AppRouteHandler<GetUsersByPermissionRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const query = c.req.valid("query");

    // Check if permission exists
    const permission = await service.findById(id);
    if (!permission) {
        return c.json(
            {
                success: false,
                message: "Permission not found",
            },
            HttpStatusCodes.NOT_FOUND
        );
    }

    const result = await service.getUsersByPermissionId(id, query);

    return c.json(
        {
            success: true,
            message: HttpStatusPhrases.OK,
            data: result.data,
            meta: result.meta,
        },
        HttpStatusCodes.OK
    );
};

/**
 * Assign Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const assignToUser: AppRouteHandler<AssignPermissionToUserRoute> = async (c) => {
    const { id: permissionId, userId } = c.req.valid("param");

    // Check if permission exists
    const permission = await service.findById(permissionId);
    if (!permission) {
        return c.json(
            {
                success: false,
                message: "Permission not found",
            },
            HttpStatusCodes.NOT_FOUND
        );
    }

    try {
        const result = await service.assignPermissionToUser(userId, permissionId);

        return c.json(
            {
                success: true,
                message: "Permission assigned to user successfully",
                data: result,
            },
            HttpStatusCodes.OK
        );
    } catch {
        return c.json(
            {
                success: false,
                message: "Failed to assign permission to user",
            },
            HttpStatusCodes.BAD_REQUEST
        );
    }
};

/**
 * Remove Assignment Controller
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const removeFromUser: AppRouteHandler<RemovePermissionFromUserRoute> = async (c) => {
    const { id: permissionId, userId } = c.req.valid("param");

    // Check if permission exists
    const permission = await service.findById(permissionId);
    if (!permission) {
        return c.json(
            {
                success: false,
                message: "Permission not found",
            },
            HttpStatusCodes.NOT_FOUND
        );
    }

    await service.removePermissionFromUser(userId, permissionId);

    return c.json(
        {
            success: true,
            message: "Permission removed from user successfully",
        },
        HttpStatusCodes.OK
    );
};
