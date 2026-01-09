/**
 * Role and Permission Factory
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { faker } from "@faker-js/faker";
import type { Prisma } from "../generated/client";

export interface RoleFactoryOptions {
    name?: string;
    description?: string;
}

export interface PermissionFactoryOptions {
    name?: string;
    description?: string;
}

/**
 * Create a single role
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {RoleFactoryOptions} options
 *
 * @returns {Prisma.RoleCreateInput}
 */
export function roleFactory(options?: RoleFactoryOptions): Prisma.RoleCreateInput {
    return {
        name: options?.name ?? faker.person.jobTitle().toLowerCase().replace(/\s+/g, "-"),
        description: options?.description ?? faker.lorem.sentence(),
    };
}

/**
 * Create multiple roles
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {number} count
 * @param {RoleFactoryOptions} options
 *
 * @returns {Prisma.RoleCreateInput[]}
 */
export function roleFactoryMany(count: number, options?: RoleFactoryOptions): Prisma.RoleCreateInput[] {
    return Array.from({ length: count }, () => roleFactory(options));
}

/**
 * Create a single permission
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {PermissionFactoryOptions} options
 *
 * @returns {Prisma.PermissionCreateInput}
 */
export function permissionFactory(options?: PermissionFactoryOptions): Prisma.PermissionCreateInput {
    const actions = ["create", "read", "update", "delete", "list", "export"];
    const resources = ["users", "posts", "comments", "products", "orders", "reports"];

    const action = faker.helpers.arrayElement(actions);
    const resource = faker.helpers.arrayElement(resources);

    return {
        name: options?.name ?? `${action}-${resource}`,
        description: options?.description ?? `Permission to ${action} ${resource}`,
    };
}

/**
 * Create multiple permissions
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {number} count
 * @param {PermissionFactoryOptions} options
 *
 * @returns {Prisma.PermissionCreateInput[]}
 */
export function permissionFactoryMany(
    count: number,
    options?: PermissionFactoryOptions
): Prisma.PermissionCreateInput[] {
    return Array.from({ length: count }, () => permissionFactory(options));
}

/**
 * Predefined roles with permissions
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const DEFAULT_ROLES = {
    ADMIN: {
        name: "admin",
        description: "Administrator with management access",
    },
    USER: {
        name: "user",
        description: "Regular user with basic access",
    },
};

/**
 * Predefined permissions
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const DEFAULT_PERMISSIONS = {
    // User permissions
    USER_CREATE: { name: "user.create", description: "Create users" },
    USER_READ: { name: "user.read", description: "Read users" },
    USER_UPDATE: { name: "user.update", description: "Update users" },
    USER_DELETE: { name: "user.delete", description: "Delete users" },

    // Role permissions
    ROLE_CREATE: { name: "role.create", description: "Create roles" },
    ROLE_READ: { name: "role.read", description: "Read roles" },
    ROLE_UPDATE: { name: "role.update", description: "Update roles" },
    ROLE_DELETE: { name: "role.delete", description: "Delete roles" },

    // Permission permissions
    PERMISSION_CREATE: { name: "permission.create", description: "Create permissions" },
    PERMISSION_READ: { name: "permission.read", description: "Read permissions" },
    PERMISSION_UPDATE: { name: "permission.update", description: "Update permissions" },
    PERMISSION_DELETE: { name: "permission.delete", description: "Delete permissions" },
};

/**
 * Get all default permissions as array
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {Prisma.PermissionCreateInput[]}
 */
export function getDefaultPermissions(): Prisma.PermissionCreateInput[] {
    return Object.values(DEFAULT_PERMISSIONS);
}

/**
 * Get all default roles as array
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {Prisma.RoleCreateInput[]}
 */
export function getDefaultRoles(): Prisma.RoleCreateInput[] {
    return Object.values(DEFAULT_ROLES);
}
