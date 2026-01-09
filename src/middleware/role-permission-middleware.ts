/**
 * Role and Permission Middleware
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { prisma } from "@prisma/db";
import type { Context, MiddlewareHandler, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

/**
 * Check if user has specific role
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} roleName - Role name to check
 *
 * @returns {MiddlewareHandler}
 */
export function requireRole(roleName: string): MiddlewareHandler {
    return async (c: Context, next: Next) => {
        const jwtPayload = c.get("jwtPayload");

        if (!jwtPayload) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
                message: "Invalid or expired token",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: jwtPayload.sub },
            select: {
                user_roles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
                message: "User not found",
            });
        }

        const hasRole = user.user_roles.some((ur) => ur.role.name === roleName);

        if (!hasRole) {
            throw new HTTPException(HttpStatusCodes.FORBIDDEN, {
                message: "Access denied",
            });
        }

        return next();
    };
}

/**
 * Check if user has any of the specified roles
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string[]} roleNames - Array of role names
 *
 * @returns {MiddlewareHandler}
 */
export function requireAnyRole(roleNames: string[]): MiddlewareHandler {
    return async (c: Context, next: Next) => {
        const jwtPayload = c.get("jwtPayload");

        if (!jwtPayload) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
                message: "Invalid or expired token",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: jwtPayload.sub },
            select: {
                user_roles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
                message: "User not found",
            });
        }

        const hasAnyRole = user.user_roles.some((ur) => roleNames.includes(ur.role.name));

        if (!hasAnyRole) {
            throw new HTTPException(HttpStatusCodes.FORBIDDEN, {
                message: "Access denied",
            });
        }

        return next();
    };
}

/**
 * Check if user has all of the specified roles
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string[]} roleNames - Array of role names
 *
 * @returns {MiddlewareHandler}
 */
export function requireAllRoles(roleNames: string[]): MiddlewareHandler {
    return async (c: Context, next: Next) => {
        const jwtPayload = c.get("jwtPayload");

        if (!jwtPayload) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
                message: "Invalid or expired token",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: jwtPayload.sub },
            select: {
                user_roles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
                message: "User not found",
            });
        }

        const userRoles = user.user_roles.map((ur) => ur.role.name);
        const hasAllRoles = roleNames.every((roleName) => userRoles.includes(roleName));

        if (!hasAllRoles) {
            throw new HTTPException(HttpStatusCodes.FORBIDDEN, {
                message: "Access denied",
            });
        }

        return next();
    };
}

/**
 * Check if user has specific permission (from role or direct)
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} permissionName - Permission name to check
 *
 * @returns {MiddlewareHandler}
 */
export function requirePermission(permissionName: string): MiddlewareHandler {
    return async (c: Context, next: Next) => {
        const jwtPayload = c.get("jwtPayload");

        if (!jwtPayload) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
                message: "Invalid or expired token",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: jwtPayload.sub },
            select: {
                user_roles: {
                    select: {
                        role: {
                            select: {
                                role_permissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                name: true,
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
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
                message: "User not found",
            });
        }

        // Collect permissions from roles
        const rolePermissions = user.user_roles.flatMap((ur) =>
            ur.role.role_permissions.map((rp) => rp.permission.name)
        );

        // Collect direct permissions
        const directPermissions = user.user_permissions.map((up) => up.permission.name);

        // Merge all permissions
        const allPermissions = [...new Set([...rolePermissions, ...directPermissions])];

        const hasPermission = allPermissions.includes(permissionName);

        if (!hasPermission) {
            throw new HTTPException(HttpStatusCodes.FORBIDDEN, {
                message: "Access denied",
            });
        }

        return next();
    };
}

/**
 * Check if user has any of the specified permissions
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string[]} permissionNames - Array of permission names
 *
 * @returns {MiddlewareHandler}
 */
export function requireAnyPermission(permissionNames: string[]): MiddlewareHandler {
    return async (c: Context, next: Next) => {
        const jwtPayload = c.get("jwtPayload");

        if (!jwtPayload) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
                message: "Invalid or expired token",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: jwtPayload.sub },
            select: {
                user_roles: {
                    select: {
                        role: {
                            select: {
                                role_permissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                name: true,
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
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
                message: "User not found",
            });
        }

        // Collect permissions from roles
        const rolePermissions = user.user_roles.flatMap((ur) =>
            ur.role.role_permissions.map((rp) => rp.permission.name)
        );

        // Collect direct permissions
        const directPermissions = user.user_permissions.map((up) => up.permission.name);

        // Merge all permissions
        const allPermissions = [...new Set([...rolePermissions, ...directPermissions])];

        const hasAnyPermission = permissionNames.some((permission) => allPermissions.includes(permission));

        if (!hasAnyPermission) {
            throw new HTTPException(HttpStatusCodes.FORBIDDEN, {
                message: "Access denied",
            });
        }

        return next();
    };
}

/**
 * Check if user has all of the specified permissions
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string[]} permissionNames - Array of permission names
 *
 * @returns {MiddlewareHandler}
 */
export function requireAllPermissions(permissionNames: string[]): MiddlewareHandler {
    return async (c: Context, next: Next) => {
        const jwtPayload = c.get("jwtPayload");

        if (!jwtPayload) {
            throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
                message: "Invalid or expired token",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: jwtPayload.sub },
            select: {
                user_roles: {
                    select: {
                        role: {
                            select: {
                                role_permissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                name: true,
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
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
                message: "User not found",
            });
        }

        // Collect permissions from roles
        const rolePermissions = user.user_roles.flatMap((ur) =>
            ur.role.role_permissions.map((rp) => rp.permission.name)
        );

        // Collect direct permissions
        const directPermissions = user.user_permissions.map((up) => up.permission.name);

        // Merge all permissions
        const allPermissions = [...new Set([...rolePermissions, ...directPermissions])];

        const hasAllPermissions = permissionNames.every((permission) => allPermissions.includes(permission));

        if (!hasAllPermissions) {
            throw new HTTPException(HttpStatusCodes.FORBIDDEN, {
                message: "Access denied",
            });
        }

        return next();
    };
}
