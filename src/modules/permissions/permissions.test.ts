/**
 * Test file for permissions module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { disconnectDb, prisma } from "@prisma/db";
import * as service from "@/modules/permissions/permissions.service";
import type {
    CreatePermissionInput,
    ParamsPermissionSchema,
    UpdatePermissionInput,
} from "@/modules/permissions/permissions.validation";

describe("Permissions Module", () => {
    let testPermissionId: string;
    let testPermissionName: string;
    let testUserId: string;

    beforeAll(async () => {
        // Create test permission
        testPermissionName = "test.permission.action";
        const permission = await prisma.permission.create({
            data: {
                name: testPermissionName,
                description: "Test permission for testing",
            },
        });
        testPermissionId = permission.id;

        // Create test user for assignment tests
        const user = await prisma.user.create({
            data: {
                name: "Test User for Permissions",
                email: `testpermission-${Date.now()}@example.com`,
                password: "hashedPassword",
            },
        });
        testUserId = user.id;
    });

    afterAll(async () => {
        // Cleanup test data - order matters due to foreign keys
        await prisma.userPermission.deleteMany({});
        await prisma.rolePermission.deleteMany({});
        await prisma.permission.deleteMany({});
        await prisma.user.deleteMany({});
        await disconnectDb();
    });

    describe("Service - getAll", () => {
        it("should get all permissions with default pagination", async () => {
            const params = {} as ParamsPermissionSchema;

            const result = await service.getAll(params);

            expect(result).toBeDefined();
            expect(result.data).toBeArray();
            expect(result.meta).toBeDefined();
            expect(result.meta.page).toBe(1);
            expect(result.meta.per_page).toBe(10);
        });

        it("should get permissions with custom pagination", async () => {
            const params = {
                page: 1,
                per_page: 5,
            } as ParamsPermissionSchema;

            const result = await service.getAll(params);

            expect(result.meta.page).toBe(1);
            expect(result.meta.per_page).toBe(5);
            expect(result.data.length).toBeLessThanOrEqual(5);
        });

        it("should search permissions by name", async () => {
            const params = {
                search: testPermissionName,
            } as ParamsPermissionSchema;

            const result = await service.getAll(params);

            expect(result.data).toBeArray();
            expect(result.data.length).toBeGreaterThanOrEqual(1);
            expect(result.data[0].name).toContain(testPermissionName);
        });

        it("should sort permissions", async () => {
            const params = {
                sort: "name",
                order: "asc",
            } as ParamsPermissionSchema;

            const result = await service.getAll(params);

            expect(result.data).toBeArray();
            if (result.data.length > 1) {
                expect(result.data[0].name.localeCompare(result.data[1].name)).toBeLessThanOrEqual(0);
            }
        });
    });

    describe("Service - findById", () => {
        it("should find permission by ID", async () => {
            const permission = await service.findById(testPermissionId);

            expect(permission).toBeDefined();
            expect(permission.id).toBe(testPermissionId);
            expect(permission.name).toBe(testPermissionName);
        });

        it("should throw error for non-existent permission", async () => {
            expect(async () => await service.findById("00000000-0000-0000-0000-000000000000")).toThrow();
        });
    });

    describe("Service - findByName", () => {
        it("should find permission by name", async () => {
            const permission = await service.findByName(testPermissionName);

            expect(permission).toBeDefined();
            expect(permission?.id).toBe(testPermissionId);
            expect(permission?.name).toBe(testPermissionName);
        });

        it("should return null for non-existent permission name", async () => {
            const permission = await service.findByName("non.existent.permission");

            expect(permission).toBeNull();
        });
    });

    describe("Service - create", () => {
        it("should create new permission", async () => {
            const data: CreatePermissionInput = {
                name: `new.test.permission.${Date.now()}`,
                description: "New test permission",
            };

            const permission = await service.create(data);

            expect(permission).toBeDefined();
            expect(permission.name).toBe(data.name);
            if (data.description !== undefined) {
                expect(permission.description).toBe(data.description);
            }
        });

        it("should create permission without description", async () => {
            const data = {
                name: `another.test.permission.${Date.now()}`,
            };

            const permission = await service.create(data);

            expect(permission).toBeDefined();
            expect(permission.name).toBe(data.name);
            expect(permission.description).toBeNull();
        });
    });

    describe("Service - update", () => {
        it("should update permission", async () => {
            const createData = {
                name: `update.test.permission.${Date.now()}`,
                description: "Permission for update testing",
            };
            const created = await service.create(createData);

            const updateData: UpdatePermissionInput = {
                name: `updated.test.permission.${Date.now()}`,
                description: "Updated description",
            };

            const updated = await service.update(created.id, updateData);

            expect(updated).toBeDefined();
            expect(updated.id).toBe(created.id);
            if (updateData.name !== undefined) {
                expect(updated.name).toBe(updateData.name);
            }
            if (updateData.description !== undefined) {
                expect(updated.description).toBe(updateData.description);
            }
        });

        it("should partially update permission", async () => {
            const createData = {
                name: `partial.update.permission.${Date.now()}`,
                description: "Original description",
            };
            const created = await service.create(createData);

            const updateData: UpdatePermissionInput = {
                description: "Only description updated",
            };

            const updated = await service.update(created.id, updateData);

            expect(updated).toBeDefined();
            expect(updated.name).toBe(created.name);
            if (updateData.description !== undefined) {
                expect(updated.description).toBe(updateData.description);
            }
        });
    });

    describe("Service - destroy", () => {
        it("should delete permission", async () => {
            const createData = {
                name: `delete.test.permission.${Date.now()}`,
                description: "Permission for deletion",
            };
            const created = await service.create(createData);

            const deleted = await service.destroy(created.id);

            expect(deleted).toBeDefined();
            expect(deleted.id).toBe(created.id);

            // Should throw error when trying to find deleted permission
            expect(async () => await service.findById(created.id)).toThrow();
        });
    });

    describe("Service - getRolesByPermissionId", () => {
        it("should get roles by permission ID", async () => {
            // Create a role
            const role = await prisma.role.create({
                data: {
                    name: `test_role_${Date.now()}`,
                    description: "Test role",
                },
            });

            // Assign permission to role
            await prisma.rolePermission.create({
                data: {
                    role_id: role.id,
                    permission_id: testPermissionId,
                },
            });

            const result = await service.getRolesByPermissionId(testPermissionId);

            expect(result.data).toBeArray();
            expect(result.data.length).toBeGreaterThanOrEqual(1);
            expect(result.data.some((r) => r.id === role.id)).toBe(true);
        });

        it("should return empty array for permission with no roles", async () => {
            const permission = await prisma.permission.create({
                data: {
                    name: `no.roles.permission.${Date.now()}`,
                    description: "Permission without roles",
                },
            });

            const result = await service.getRolesByPermissionId(permission.id);

            expect(result.data).toBeArray();
            expect(result.data.length).toBe(0);
        });
    });

    describe("Service - getUsersByPermissionId", () => {
        it("should get users by permission ID", async () => {
            // Assign permission to user
            await prisma.userPermission.create({
                data: {
                    user_id: testUserId,
                    permission_id: testPermissionId,
                },
            });

            const result = await service.getUsersByPermissionId(testPermissionId);

            expect(result.data).toBeArray();
            expect(result.data.length).toBeGreaterThanOrEqual(1);
            expect(result.data.some((u) => u.id === testUserId)).toBe(true);
        });

        it("should return empty array for permission with no direct users", async () => {
            const permission = await prisma.permission.create({
                data: {
                    name: `no.users.permission.${Date.now()}`,
                    description: "Permission without users",
                },
            });

            const result = await service.getUsersByPermissionId(permission.id);

            expect(result.data).toBeArray();
            expect(result.data.length).toBe(0);
        });
    });

    describe("Service - assignPermissionToUser", () => {
        it("should assign permission to user", async () => {
            const permission = await prisma.permission.create({
                data: {
                    name: `assign.user.permission.${Date.now()}`,
                    description: "Permission for user assignment",
                },
            });

            const user = await prisma.user.create({
                data: {
                    name: "User for Permission Assignment",
                    email: `assign-user-${Date.now()}@example.com`,
                    password: "hashedPassword",
                },
            });

            const result = await service.assignPermissionToUser(user.id, permission.id);

            expect(result).toBeDefined();
            expect(result.user.id).toBe(user.id);
            expect(result.permission.id).toBe(permission.id);
        });
    });

    describe("Service - removePermissionFromUser", () => {
        it("should remove permission from user", async () => {
            const permission = await prisma.permission.create({
                data: {
                    name: `remove.user.permission.${Date.now()}`,
                    description: "Permission for user removal",
                },
            });

            const user = await prisma.user.create({
                data: {
                    name: "User for Permission Removal",
                    email: `remove-user-${Date.now()}@example.com`,
                    password: "hashedPassword",
                },
            });

            // Assign first
            await prisma.userPermission.create({
                data: {
                    user_id: user.id,
                    permission_id: permission.id,
                },
            });

            // Then remove
            const result = await service.removePermissionFromUser(user.id, permission.id);

            expect(result).toBeDefined();

            // Verify it's removed
            const userPermission = await prisma.userPermission.findFirst({
                where: {
                    user_id: user.id,
                    permission_id: permission.id,
                },
            });
            expect(userPermission).toBeNull();
        });
    });

    describe("Integration", () => {
        it("should complete full CRUD flow", async () => {
            // Create
            const createData: CreatePermissionInput = {
                name: `integration.test.permission.${Date.now()}`,
                description: "Integration test permission",
            };
            const created = await service.create(createData);
            expect(created.name).toBe(createData.name);

            // Read
            const found = await service.findById(created.id);
            expect(found).toBeDefined();
            expect(found.id).toBe(created.id);

            const foundByName = await service.findByName(created.name);
            expect(foundByName).toBeDefined();
            expect(foundByName?.id).toBe(created.id);

            // Update
            const updateData: UpdatePermissionInput = {
                name: `updated.integration.permission.${Date.now()}`,
                description: "Updated integration description",
            };
            const updated = await service.update(created.id, updateData);
            if (updateData.name !== undefined) {
                expect(updated.name).toBe(updateData.name);
            }
            if (updateData.description !== undefined) {
                expect(updated.description).toBe(updateData.description);
            }

            // List
            const list = await service.getAll({ search: updateData.name });
            expect(list.data.length).toBeGreaterThanOrEqual(1);
            expect(list.data.some((p) => p.id === created.id)).toBe(true);

            // Delete
            await service.destroy(created.id);

            // Should throw error when trying to find deleted permission
            expect(async () => await service.findById(created.id)).toThrow();
        });
    });
});
