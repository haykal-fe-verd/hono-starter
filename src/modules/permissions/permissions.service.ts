/**
 * Service functions for the permissions module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { prisma } from "@prisma/db";
import type { Prisma } from "@prisma/generated/client";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { Meta } from "@/lib/types";

interface GetPermissionsParams {
    search?: string;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: "asc" | "desc";
}

const selectPermissionFields = {
    id: true,
    name: true,
    description: true,
    created_at: true,
    updated_at: true,
    role_permissions: {
        include: {
            role: true,
        },
    },
    _count: {
        select: {
            user_permissions: true,
        },
    },
} as const satisfies Prisma.PermissionSelect;

type PermissionWithRelations = Prisma.PermissionGetPayload<{
    select: typeof selectPermissionFields;
}>;

export interface DataPermissionSchema {
    id: string;
    name: string;
    description: string | null;
    roles: Array<{
        id: string;
        name: string;
        description: string | null;
        created_at: string;
        updated_at: string;
    }>;
    users_count: number;
    created_at: string;
    updated_at: string;
}

interface RoleData {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    email_verified_at: Date | null;
    avatar: string | null;
    created_at: Date;
    updated_at: Date;
}

/**
 * Transform permission service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {PermissionWithRelations} permission
 *
 * @returns {DataPermissionSchema}
 */
export const transformPermission = (permission: PermissionWithRelations): DataPermissionSchema => {
    return {
        id: permission.id,
        name: permission.name,
        description: permission.description,
        roles:
            permission.role_permissions?.map((rp) => ({
                id: rp.role.id,
                name: rp.role.name,
                description: rp.role.description,
                created_at: rp.role.created_at.toISOString(),
                updated_at: rp.role.updated_at.toISOString(),
            })) || [],
        users_count: permission._count.user_permissions,
        created_at: permission.created_at.toISOString(),
        updated_at: permission.updated_at.toISOString(),
    };
};

/**
 * Get all permissions service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {GetPermissionsParams} params
 *
 * @returns {Promise<{ data: DataPermissionSchema[]; meta: Meta }>}
 */
export const getAll = async (
    params: GetPermissionsParams = {}
): Promise<{ data: DataPermissionSchema[]; meta: Meta }> => {
    const { search, page = 1, per_page = 10, sort = "created_at", order = "desc" } = params;
    const skip = (page - 1) * per_page;

    const where = search
        ? {
              OR: [
                  { name: { contains: search, mode: "insensitive" as const } },
                  { description: { contains: search, mode: "insensitive" as const } },
              ],
          }
        : {};

    const total = await prisma.permission.count({ where });

    const permissions = await prisma.permission.findMany({
        where,
        skip,
        take: per_page,
        orderBy: { [sort]: order },
        select: selectPermissionFields,
    });

    const total_page = Math.ceil(total / per_page);
    const has_next_page = page < total_page;
    const has_prev_page = page > 1;

    const meta: Meta = {
        total,
        page,
        per_page,
        total_page,
        has_next_page,
        has_prev_page,
    };

    const transformedPermissions = permissions.map(transformPermission);

    return {
        data: transformedPermissions,
        meta,
    };
};

/**
 * Find by ID service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id
 *
 * @returns {Promise<DataPermissionSchema>}
 */
export const findById = async (id: string): Promise<DataPermissionSchema> => {
    const permission = await prisma.permission.findUnique({
        where: { id },
        select: selectPermissionFields,
    });

    if (!permission) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "Permission not found",
        });
    }

    return transformPermission(permission);
};

/**
 * Find by name service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} name
 *
 * @returns {Promise<PermissionWithRelations | null>}
 */
export const findByName = async (name: string): Promise<PermissionWithRelations | null> => {
    const permission = await prisma.permission.findUnique({
        where: { name },
        select: selectPermissionFields,
    });

    return permission;
};

/**
 * Create service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string | null} [data.description]
 *
 * @returns {Promise<DataPermissionSchema>}
 */
export const create = async (data: { name: string; description?: string | null }): Promise<DataPermissionSchema> => {
    // Check if permission already exists
    const existingPermission = await findByName(data.name);
    if (existingPermission) {
        throw new HTTPException(HttpStatusCodes.CONFLICT, {
            message: "Permission with this name already exists",
        });
    }

    const permission = await prisma.permission.create({
        data,
        select: selectPermissionFields,
    });

    return transformPermission(permission);
};

/**
 * Update service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id
 * @param {Object} data
 * @param {string} [data.name]
 * @param {string | null} [data.description]
 *
 * @returns {Promise<DataPermissionSchema>}
 */
export const update = async (
    id: string,
    data: { name?: string; description?: string | null }
): Promise<DataPermissionSchema> => {
    // Check if permission exists
    await findById(id);

    // Check if new name already exists (if name is being changed)
    if (data.name) {
        const existingPermission = await findByName(data.name);
        if (existingPermission && existingPermission.id !== id) {
            throw new HTTPException(HttpStatusCodes.CONFLICT, {
                message: "Permission with this name already exists",
            });
        }
    }

    const permission = await prisma.permission.update({
        where: { id },
        data,
        select: selectPermissionFields,
    });

    return transformPermission(permission);
};

/**
 * Destroy service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id
 *
 * @returns {Promise<DataPermissionSchema>}
 */
export const destroy = async (id: string): Promise<DataPermissionSchema> => {
    // Check if permission exists
    await findById(id);

    const permission = await prisma.permission.delete({
        where: { id },
        select: selectPermissionFields,
    });

    return transformPermission(permission);
};

/**
 * Get roles by permission ID
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} permissionId
 * @param {GetPermissionsParams} params
 *
 * @returns {Promise<{ data: RoleData[]; meta: Meta }>}
 */
export const getRolesByPermissionId = async (
    permissionId: string,
    params: GetPermissionsParams = {}
): Promise<{ data: RoleData[]; meta: Meta }> => {
    // Check if permission exists
    await findById(permissionId);

    const { page = 1, per_page = 10 } = params;
    const skip = (page - 1) * per_page;

    const total = await prisma.rolePermission.count({
        where: { permission_id: permissionId },
    });

    const rolePermissions = await prisma.rolePermission.findMany({
        where: { permission_id: permissionId },
        skip,
        take: per_page,
        select: {
            role: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    created_at: true,
                    updated_at: true,
                },
            },
        },
    });

    const roles = rolePermissions.map((rp) => rp.role);

    const total_page = Math.ceil(total / per_page);
    const has_next_page = page < total_page;
    const has_prev_page = page > 1;

    const meta: Meta = {
        total,
        page,
        per_page,
        total_page,
        has_next_page,
        has_prev_page,
    };

    return {
        data: roles,
        meta,
    };
};

/**
 * Get users by permission ID
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} permissionId
 * @param {GetPermissionsParams} params
 *
 * @returns {Promise<{ data: UserData[]; meta: Meta }>}
 */
export const getUsersByPermissionId = async (
    permissionId: string,
    params: GetPermissionsParams = {}
): Promise<{ data: UserData[]; meta: Meta }> => {
    // Check if permission exists
    await findById(permissionId);

    const { page = 1, per_page = 10 } = params;
    const skip = (page - 1) * per_page;

    const total = await prisma.userPermission.count({
        where: { permission_id: permissionId },
    });

    const userPermissions = await prisma.userPermission.findMany({
        where: { permission_id: permissionId },
        skip,
        take: per_page,
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    email_verified_at: true,
                    avatar: true,
                    created_at: true,
                    updated_at: true,
                },
            },
        },
    });

    const users = userPermissions.map((up) => up.user);

    const total_page = Math.ceil(total / per_page);
    const has_next_page = page < total_page;
    const has_prev_page = page > 1;

    const meta: Meta = {
        total,
        page,
        per_page,
        total_page,
        has_next_page,
        has_prev_page,
    };

    return {
        data: users,
        meta,
    };
};

/**
 * Assign permission to user
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} userId
 * @param {string} permissionId
 *
 * @returns {Promise}
 */
export const assignPermissionToUser = async (userId: string, permissionId: string) => {
    // Check if permission exists
    const permission = await prisma.permission.findUnique({
        where: { id: permissionId },
    });

    if (!permission) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "Permission not found",
        });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "User not found",
        });
    }

    // Check if user already has this permission
    const existingUserPermission = await prisma.userPermission.findFirst({
        where: {
            user_id: userId,
            permission_id: permissionId,
        },
    });

    if (existingUserPermission) {
        throw new HTTPException(HttpStatusCodes.CONFLICT, {
            message: "User already has this permission",
        });
    }

    const userPermission = await prisma.userPermission.create({
        data: {
            user_id: userId,
            permission_id: permissionId,
        },
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            permission: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
        },
    });

    return userPermission;
};

/**
 * Remove permission from user
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} userId
 * @param {string} permissionId
 *
 * @returns {Promise}
 */
export const removePermissionFromUser = async (userId: string, permissionId: string) => {
    // Check if permission exists
    const permission = await prisma.permission.findUnique({
        where: { id: permissionId },
    });

    if (!permission) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "Permission not found",
        });
    }

    // Check if user has this permission
    const existingUserPermission = await prisma.userPermission.findFirst({
        where: {
            user_id: userId,
            permission_id: permissionId,
        },
    });

    if (!existingUserPermission) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "User does not have this permission",
        });
    }

    const userPermission = await prisma.userPermission.deleteMany({
        where: {
            user_id: userId,
            permission_id: permissionId,
        },
    });

    return userPermission;
};
