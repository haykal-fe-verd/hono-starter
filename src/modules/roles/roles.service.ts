/**
 * Service functions for the roles module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { prisma } from "@prisma/db";
import type { Prisma } from "@prisma/generated/client";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { Meta } from "@/lib/types";
import type {
    CreateRoleInput,
    DataRoleSchema,
    ParamsRoleSchema,
    UpdateRoleInput,
} from "@/modules/roles/roles.validation";

const selectRoleFields = {
    id: true,
    name: true,
    description: true,
    created_at: true,
    updated_at: true,
    role_permissions: {
        include: {
            permission: true,
        },
    },
    _count: {
        select: {
            user_roles: true,
        },
    },
} as const satisfies Prisma.RoleSelect;

type RoleWithRelations = Prisma.RoleGetPayload<{
    select: typeof selectRoleFields;
}>;

/**
 * Transform role service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {RoleWithRelations} role
 *
 * @returns {DataRoleSchema}
 */
export const transformRole = (role: RoleWithRelations): DataRoleSchema => {
    return {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.role_permissions?.map((rp) => rp.permission) || [],
        users_count: role._count.user_roles,
        created_at: role.created_at.toISOString(),
        updated_at: role.updated_at.toISOString(),
    };
};

/**
 * Get all roles service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {ParamsRoleSchema} params
 *
 * @returns {Promise<{ data: DataRoleSchema[]; meta: Meta }>}
 */
export const getAll = async (
    params: Partial<ParamsRoleSchema> = {}
): Promise<{ data: DataRoleSchema[]; meta: Meta }> => {
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

    const total = await prisma.role.count({ where });

    const roles = await prisma.role.findMany({
        where,
        skip,
        take: per_page,
        orderBy: { [sort]: order },
        select: selectRoleFields,
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

    const transformedRoles = roles.map(transformRole);

    return {
        data: transformedRoles,
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
 * @returns {Promise<DataRoleSchema>}
 */
export const findById = async (id: string): Promise<DataRoleSchema> => {
    const role = await prisma.role.findUnique({
        where: { id },
        select: selectRoleFields,
    });

    if (!role) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "Role not found",
        });
    }

    return transformRole(role);
};

/**
 * Find by name service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} name
 *
 * @returns {Promise<RoleWithRelations | null>}
 */
export const findByName = async (name: string): Promise<RoleWithRelations | null> => {
    const role = await prisma.role.findUnique({
        where: { name },
        select: selectRoleFields,
    });

    return role;
};

/**
 * Create service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {CreateRoleInput} data
 *
 * @returns {Promise<DataRoleSchema>}
 */
export const create = async (data: CreateRoleInput): Promise<DataRoleSchema> => {
    // Check if role already exists
    const existingRole = await findByName(data.name);
    if (existingRole) {
        throw new HTTPException(HttpStatusCodes.CONFLICT, {
            message: "Role with this name already exists",
        });
    }

    const role = await prisma.role.create({
        data,
        select: selectRoleFields,
    });

    return transformRole(role);
};

/**
 * Update service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id
 * @param {UpdateRoleInput} data
 *
 * @returns {Promise<DataRoleSchema>}
 */
export const update = async (id: string, data: UpdateRoleInput): Promise<DataRoleSchema> => {
    // Check if role exists
    await findById(id);

    // Check if new name already exists (if name is being changed)
    if (data.name) {
        const existingRole = await findByName(data.name);
        if (existingRole && existingRole.id !== id) {
            throw new HTTPException(HttpStatusCodes.CONFLICT, {
                message: "Role with this name already exists",
            });
        }
    }

    const role = await prisma.role.update({
        where: { id },
        data,
        select: selectRoleFields,
    });

    return transformRole(role);
};

/**
 * Destroy service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id
 *
 * @returns {Promise<DataRoleSchema>}
 */
export const destroy = async (id: string): Promise<DataRoleSchema> => {
    // Check if role exists
    await findById(id);

    const role = await prisma.role.delete({
        where: { id },
        select: selectRoleFields,
    });

    return transformRole(role);
};

/**
 * Get users by role ID
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} roleId
 * @param {ParamsRoleSchema} params
 *
 * @returns {Promise<{ data: any[]; meta: Meta }>}
 */
export const getUsersByRoleId = async (roleId: string, params: Partial<ParamsRoleSchema> = {}) => {
    // Check if role exists
    await findById(roleId);

    const { page = 1, per_page = 10 } = params;
    const skip = (page - 1) * per_page;

    const total = await prisma.userRole.count({
        where: { role_id: roleId },
    });

    const userRoles = await prisma.userRole.findMany({
        where: { role_id: roleId },
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

    const users = userRoles.map((ur) => ur.user);

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
 * Assign role to user
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} userId
 * @param {string} roleId
 *
 * @returns {Promise}
 */
export const assignRoleToUser = async (userId: string, roleId: string) => {
    // Check if role exists
    await findById(roleId);

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "User not found",
        });
    }

    // Check if user already has this role
    const existingUserRole = await prisma.userRole.findFirst({
        where: {
            user_id: userId,
            role_id: roleId,
        },
    });

    if (existingUserRole) {
        throw new HTTPException(HttpStatusCodes.CONFLICT, {
            message: "User already has this role",
        });
    }

    const userRole = await prisma.userRole.create({
        data: {
            user_id: userId,
            role_id: roleId,
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
            role: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
        },
    });

    return userRole;
};

/**
 * Remove role from user
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} userId
 * @param {string} roleId
 *
 * @returns {Promise}
 */
export const removeRoleFromUser = async (userId: string, roleId: string) => {
    // Check if role exists
    await findById(roleId);

    // Check if user has this role
    const existingUserRole = await prisma.userRole.findFirst({
        where: {
            user_id: userId,
            role_id: roleId,
        },
    });

    if (!existingUserRole) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "User does not have this role",
        });
    }

    const userRole = await prisma.userRole.deleteMany({
        where: {
            user_id: userId,
            role_id: roleId,
        },
    });

    return userRole;
};

/**
 * Assign permission to role
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} roleId
 * @param {string} permissionId
 *
 * @returns {Promise}
 */
export const assignPermissionToRole = async (roleId: string, permissionId: string) => {
    // Check if role exists
    await findById(roleId);

    // Check if permission exists
    const permission = await prisma.permission.findUnique({
        where: { id: permissionId },
    });

    if (!permission) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "Permission not found",
        });
    }

    // Check if role already has this permission
    const existingRolePermission = await prisma.rolePermission.findFirst({
        where: {
            role_id: roleId,
            permission_id: permissionId,
        },
    });

    if (existingRolePermission) {
        throw new HTTPException(HttpStatusCodes.CONFLICT, {
            message: "Role already has this permission",
        });
    }

    const rolePermission = await prisma.rolePermission.create({
        data: {
            role_id: roleId,
            permission_id: permissionId,
        },
        select: {
            id: true,
            role: {
                select: {
                    id: true,
                    name: true,
                    description: true,
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

    return rolePermission;
};

/**
 * Remove permission from role
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} roleId
 * @param {string} permissionId
 *
 * @returns {Promise}
 */
export const removePermissionFromRole = async (roleId: string, permissionId: string) => {
    // Check if role exists
    await findById(roleId);

    // Check if role has this permission
    const existingRolePermission = await prisma.rolePermission.findFirst({
        where: {
            role_id: roleId,
            permission_id: permissionId,
        },
    });

    if (!existingRolePermission) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "Role does not have this permission",
        });
    }

    const rolePermission = await prisma.rolePermission.deleteMany({
        where: {
            role_id: roleId,
            permission_id: permissionId,
        },
    });

    return rolePermission;
};
