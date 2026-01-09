/**
 * Service functions for the users module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { prisma } from "@prisma/db";
import type { Prisma } from "@prisma/generated/client";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { Meta } from "@/lib/types";
import { hashPassword } from "@/lib/utils";
import type {
    CreateUserInput,
    DataUserSchema,
    ParamsUserSchema,
    UpdateUserInput,
} from "@/modules/users/users.validation";

const selectUserFields = {
    id: true,
    name: true,
    email: true,
    email_verified_at: true,
    avatar: true,
    created_at: true,
    updated_at: true,
    user_roles: {
        select: {
            role: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    role_permissions: {
                        select: {
                            permission: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    user_permissions: {
        select: {
            permission: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
        },
    },
} as const satisfies Prisma.UserSelect;

type UserWithRelations = Prisma.UserGetPayload<{
    select: typeof selectUserFields;
}>;

type UserWithPassword = UserWithRelations & { password: string };

/**
 * Transform user service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {UserWithRelations} user
 *
 * @returns {Promise<DataUserSchema>}
 */
export const transformUser = (user: UserWithRelations): DataUserSchema => {
    const rolePermissions = user.user_roles?.flatMap((ur) => ur.role.role_permissions.map((rp) => rp.permission)) || [];

    const directPermissions = user.user_permissions?.map((up) => up.permission) || [];

    const allPermissions = [...rolePermissions, ...directPermissions];
    const uniquePermissions = Array.from(new Map(allPermissions.map((p) => [p.id, p])).values());

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: user.email_verified_at ? user.email_verified_at.toISOString() : null,
        avatar: user.avatar,
        roles:
            user.user_roles?.map((ur) => ({
                id: ur.role.id,
                name: ur.role.name,
                description: ur.role.description,
            })) || [],
        permissions: uniquePermissions,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
    };
};

/**
 * Get all users service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {ParamsUserSchema} params
 *
 * @returns {Promise<{ data: DataUserSchema[]; meta: Meta }>}
 */
export const getAll = async (params: ParamsUserSchema): Promise<{ data: DataUserSchema[]; meta: Meta }> => {
    const { search, page = 1, per_page = 10, sort = "created_at", order = "desc" } = params;
    const skip = (page - 1) * per_page;

    const where = search
        ? {
              OR: [
                  { name: { contains: search, mode: "insensitive" as const } },
                  { email: { contains: search, mode: "insensitive" as const } },
              ],
          }
        : {};

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
        where,
        skip,
        take: per_page,
        orderBy: { [sort]: order },
        select: selectUserFields,
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

    const transformedUsers = users.map(transformUser);

    return {
        data: transformedUsers,
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
 * @returns {Promise<DataUserSchema>}
 */
export const findById = async (id: string): Promise<DataUserSchema> => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: selectUserFields,
    });

    if (!user) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "User not found",
        });
    }

    return transformUser(user);
};

/**
 * Find by email service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} email
 *
 * @returns {Promise<UserWithPassword | null>}
 */
export const findByEmail = async (email: string): Promise<UserWithPassword | null> => {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { ...selectUserFields, password: true },
    });

    return user;
};

/**
 * Create service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {CreateUserInput} data
 *
 * @returns {Promise<DataUserSchema>}
 */
export const create = async (data: CreateUserInput): Promise<DataUserSchema> => {
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
        select: selectUserFields,
    });

    return transformUser(user);
};

/**
 * Update service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id
 * @param {UpdateUserInput} data
 *
 * @returns {Promise<DataUserSchema>}
 */
export const update = async (id: string, data: UpdateUserInput): Promise<DataUserSchema> => {
    const updateData = { ...data };

    if (data.password) {
        updateData.password = await hashPassword(data.password);
    }

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: selectUserFields,
    });

    return transformUser(user);
};

/**
 * Destroy service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id
 *
 * @returns {Promise<DataUserSchema>}
 */
export const destroy = async (id: string): Promise<DataUserSchema> => {
    const user = await prisma.user.delete({
        where: { id },
        select: selectUserFields,
    });

    return transformUser(user);
};
