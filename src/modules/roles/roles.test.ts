/**
 * Test cases for the roles module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { disconnectDb, prisma } from "@prisma/db";
import * as service from "@/modules/roles/roles.service";
import type { CreateRoleInput, ParamsRoleSchema, UpdateRoleInput } from "@/modules/roles/roles.validation";

describe("Roles Module", () => {
    let testRoleId: string;
    let testRoleName: string;

    beforeAll(async () => {
        // Create test permission
        const permission = await prisma.permission.create({
            data: {
                name: "test.role.permission",
                description: "Test permission for roles module",
            },
        });

        // Create test role
        testRoleName = "test_role";
        const role = await prisma.role.create({
            data: {
                name: testRoleName,
                description: "Test role for testing",
            },
        });
        testRoleId = role.id;

        // Assign permission to role
        await prisma.rolePermission.create({
            data: {
                role_id: role.id,
                permission_id: permission.id,
            },
        });

        // Create test user
        const user = await prisma.user.create({
            data: {
                name: "Test User for Roles",
                email: `testrole-${Date.now()}@example.com`,
                password: "hashedPassword",
            },
        });

        // Assign role to user
        await prisma.userRole.create({
            data: {
                user_id: user.id,
                role_id: role.id,
            },
        });
    });

    afterAll(async () => {
        // Cleanup test data - order matters due to foreign keys
        await prisma.userRole.deleteMany({});
        await prisma.rolePermission.deleteMany({});
        await prisma.user.deleteMany({});
        await prisma.role.deleteMany({});
        await prisma.permission.deleteMany({});
        await disconnectDb();
    });

    describe("Service - getAll", () => {
        it("should get all roles with default pagination", async () => {
            const params = {} as ParamsRoleSchema;

            const result = await service.getAll(params);

            expect(result).toBeDefined();
            expect(result.data).toBeArray();
            expect(result.meta).toBeDefined();
            expect(result.meta.page).toBe(1);
            expect(result.meta.per_page).toBe(10);
        });

        it("should get roles with custom pagination", async () => {
            const params = {
                page: 1,
                per_page: 5,
            } as ParamsRoleSchema;

            const result = await service.getAll(params);

            expect(result.meta.page).toBe(1);
            expect(result.meta.per_page).toBe(5);
            expect(result.data.length).toBeLessThanOrEqual(5);
        });

        it("should search roles by name", async () => {
            const params = {
                search: testRoleName,
            } as ParamsRoleSchema;

            const result = await service.getAll(params);

            expect(result.data).toBeArray();
            expect(result.data.length).toBeGreaterThanOrEqual(1);
            expect(result.data[0].name).toContain(testRoleName);
        });

        it("should return roles with permissions", async () => {
            const params = {
                search: testRoleName,
            } as ParamsRoleSchema;

            const result = await service.getAll(params);

            expect(result.data.length).toBeGreaterThanOrEqual(1);
            // Find the role that matches exactly (not just contains)
            const role = result.data.find((r) => r.name === testRoleName);
            expect(role).toBeDefined();
            if (!role) {
                throw new Error("Test role not found");
            }
            expect(role.permissions).toBeArray();
            expect(role.permissions.length).toBeGreaterThanOrEqual(1);
        });

        it("should return roles with users_count", async () => {
            const params = {
                search: testRoleName,
            } as ParamsRoleSchema;

            const result = await service.getAll(params);

            expect(result.data.length).toBeGreaterThanOrEqual(1);
            const role = result.data[0];
            expect(typeof role.users_count).toBe("number");
            expect(role.users_count).toBeGreaterThanOrEqual(1);
        });

        it("should sort roles by name ascending", async () => {
            const params = {
                sort: "name",
                order: "asc",
            } as ParamsRoleSchema;

            const result = await service.getAll(params);

            expect(result.data).toBeArray();
            if (result.data.length >= 2) {
                expect(result.data[0].name.localeCompare(result.data[1].name)).toBeLessThanOrEqual(0);
            }
        });
    });

    describe("Service - findById", () => {
        it("should find role by id", async () => {
            const result = await service.findById(testRoleId);

            expect(result).toBeDefined();
            expect(result.id).toBe(testRoleId);
            expect(result.name).toBe(testRoleName);
        });

        it("should return role with permissions", async () => {
            const result = await service.findById(testRoleId);

            expect(result.permissions).toBeArray();
            expect(result.permissions.length).toBeGreaterThanOrEqual(1);
            expect(result.permissions[0].name).toBe("test.role.permission");
        });

        it("should return role with users_count", async () => {
            const result = await service.findById(testRoleId);

            expect(typeof result.users_count).toBe("number");
            expect(result.users_count).toBeGreaterThanOrEqual(1);
        });

        it("should throw error for non-existent role", async () => {
            const fakeRoleId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.findById(fakeRoleId)).toThrow();
        });

        it("should return dates as ISO strings", async () => {
            const result = await service.findById(testRoleId);

            expect(typeof result.created_at).toBe("string");
            expect(typeof result.updated_at).toBe("string");
            expect(() => new Date(result.created_at)).not.toThrow();
            expect(() => new Date(result.updated_at)).not.toThrow();
        });
    });

    describe("Service - findByName", () => {
        it("should find role by name", async () => {
            const result = await service.findByName(testRoleName);

            expect(result).toBeDefined();
            expect(result?.name).toBe(testRoleName);
        });

        it("should return null for non-existent name", async () => {
            const result = await service.findByName("nonexistent_role");

            expect(result).toBeNull();
        });
    });

    describe("Service - create", () => {
        it("should create a new role", async () => {
            const roleData: CreateRoleInput = {
                name: "new_test_role",
                description: "New test role description",
            };

            const result = await service.create(roleData);

            expect(result).toBeDefined();
            expect(result.name).toBe(roleData.name);
            if (roleData.description) {
                expect(result.description).toBe(roleData.description);
            }
            expect(result.id).toBeDefined();
        });

        it("should create role without description", async () => {
            const roleData: CreateRoleInput = {
                name: "another_test_role",
            };

            const result = await service.create(roleData);

            expect(result).toBeDefined();
            expect(result.name).toBe(roleData.name);
            // Description should be null or undefined when not provided
            expect(result.description == null).toBe(true);
        });

        it("should throw error for duplicate role name", async () => {
            const roleData: CreateRoleInput = {
                name: testRoleName,
                description: "Duplicate role",
            };

            expect(async () => await service.create(roleData)).toThrow();
        });
    });

    describe("Service - update", () => {
        let updateTestRoleId: string;

        beforeAll(async () => {
            const role = await prisma.role.create({
                data: {
                    name: "update_test_role",
                    description: "Role for update testing",
                },
            });
            updateTestRoleId = role.id;
        });

        it("should update role name", async () => {
            const updateData: UpdateRoleInput = {
                name: "updated_role_name",
            };

            const result = await service.update(updateTestRoleId, updateData);

            expect(result.name).toBe("updated_role_name");
        });

        it("should update role description", async () => {
            const updateData: UpdateRoleInput = {
                description: "Updated description",
            };

            const result = await service.update(updateTestRoleId, updateData);

            expect(result.description).toBe("Updated description");
        });

        it("should update multiple fields at once", async () => {
            const updateData: UpdateRoleInput = {
                name: "multi_updated_role",
                description: "Multi updated description",
            };

            const result = await service.update(updateTestRoleId, updateData);

            expect(result.name).toBe("multi_updated_role");
            expect(result.description).toBe("Multi updated description");
        });

        it("should throw error for non-existent role", async () => {
            const fakeRoleId = "00000000-0000-0000-0000-000000000000";
            const updateData: UpdateRoleInput = {
                name: "should_fail",
            };

            expect(async () => await service.update(fakeRoleId, updateData)).toThrow();
        });
    });

    describe("Service - destroy", () => {
        it("should delete role", async () => {
            const role = await prisma.role.create({
                data: {
                    name: "delete_test_role",
                    description: "Role for delete testing",
                },
            });

            const result = await service.destroy(role.id);

            expect(result).toBeDefined();
            expect(result.id).toBe(role.id);
            expect(result.name).toBe("delete_test_role");

            // Verify role is deleted
            const foundRole = await prisma.role.findUnique({ where: { id: role.id } });
            expect(foundRole).toBeNull();
        });

        it("should throw error for non-existent role", async () => {
            const fakeRoleId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.destroy(fakeRoleId)).toThrow();
        });
    });

    describe("Service - getUsersByRoleId", () => {
        it("should get users by role id", async () => {
            const result = await service.getUsersByRoleId(testRoleId);

            expect(result).toBeDefined();
            expect(result.data).toBeArray();
            expect(result.data.length).toBeGreaterThanOrEqual(1);
            expect(result.meta).toBeDefined();
        });

        it("should get users with pagination", async () => {
            const result = await service.getUsersByRoleId(testRoleId, { page: 1, per_page: 5 });

            expect(result.meta.page).toBe(1);
            expect(result.meta.per_page).toBe(5);
        });

        it("should throw error for non-existent role", async () => {
            const fakeRoleId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.getUsersByRoleId(fakeRoleId)).toThrow();
        });
    });

    describe("Service - assignRoleToUser", () => {
        let newUserId: string;
        let newRoleId: string;

        beforeAll(async () => {
            const user = await prisma.user.create({
                data: {
                    name: "New User for Role Assignment",
                    email: `newuserrole-${Date.now()}@example.com`,
                    password: "hashedPassword",
                },
            });
            newUserId = user.id;

            const role = await prisma.role.create({
                data: {
                    name: "assign_test_role",
                    description: "Role for assignment testing",
                },
            });
            newRoleId = role.id;
        });

        it("should assign role to user", async () => {
            const result = await service.assignRoleToUser(newUserId, newRoleId);

            expect(result).toBeDefined();
            expect(result.user.id).toBe(newUserId);
            expect(result.role.id).toBe(newRoleId);
        });

        it("should throw error for duplicate assignment", async () => {
            expect(async () => await service.assignRoleToUser(newUserId, newRoleId)).toThrow();
        });

        it("should throw error for non-existent user", async () => {
            const fakeUserId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.assignRoleToUser(fakeUserId, newRoleId)).toThrow();
        });

        it("should throw error for non-existent role", async () => {
            const fakeRoleId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.assignRoleToUser(newUserId, fakeRoleId)).toThrow();
        });
    });

    describe("Service - removeRoleFromUser", () => {
        let removeTestUserId: string;
        let removeTestRoleId: string;

        beforeAll(async () => {
            const user = await prisma.user.create({
                data: {
                    name: "User for Role Removal",
                    email: `removeuserrole-${Date.now()}@example.com`,
                    password: "hashedPassword",
                },
            });
            removeTestUserId = user.id;

            const role = await prisma.role.create({
                data: {
                    name: "remove_test_role",
                    description: "Role for removal testing",
                },
            });
            removeTestRoleId = role.id;

            await prisma.userRole.create({
                data: {
                    user_id: user.id,
                    role_id: role.id,
                },
            });
        });

        it("should remove role from user", async () => {
            const result = await service.removeRoleFromUser(removeTestUserId, removeTestRoleId);

            expect(result).toBeDefined();

            // Verify role is removed
            const userRole = await prisma.userRole.findFirst({
                where: {
                    user_id: removeTestUserId,
                    role_id: removeTestRoleId,
                },
            });
            expect(userRole).toBeNull();
        });

        it("should throw error for non-existent assignment", async () => {
            expect(async () => await service.removeRoleFromUser(removeTestUserId, removeTestRoleId)).toThrow();
        });

        it("should throw error for non-existent role", async () => {
            const fakeRoleId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.removeRoleFromUser(removeTestUserId, fakeRoleId)).toThrow();
        });
    });

    describe("Service - assignPermissionToRole", () => {
        let newRoleId: string;
        let newPermissionId: string;

        beforeAll(async () => {
            const role = await prisma.role.create({
                data: {
                    name: "permission_assign_role",
                    description: "Role for permission assignment testing",
                },
            });
            newRoleId = role.id;

            const permission = await prisma.permission.create({
                data: {
                    name: "test.assign.permission",
                    description: "Permission for assignment testing",
                },
            });
            newPermissionId = permission.id;
        });

        it("should assign permission to role", async () => {
            const result = await service.assignPermissionToRole(newRoleId, newPermissionId);

            expect(result).toBeDefined();
            expect(result.role.id).toBe(newRoleId);
            expect(result.permission.id).toBe(newPermissionId);
        });

        it("should throw error for duplicate assignment", async () => {
            expect(async () => await service.assignPermissionToRole(newRoleId, newPermissionId)).toThrow();
        });

        it("should throw error for non-existent role", async () => {
            const fakeRoleId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.assignPermissionToRole(fakeRoleId, newPermissionId)).toThrow();
        });

        it("should throw error for non-existent permission", async () => {
            const fakePermissionId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.assignPermissionToRole(newRoleId, fakePermissionId)).toThrow();
        });
    });

    describe("Service - removePermissionFromRole", () => {
        let removeTestRoleId: string;
        let removeTestPermissionId: string;

        beforeAll(async () => {
            const role = await prisma.role.create({
                data: {
                    name: "permission_remove_role",
                    description: "Role for permission removal testing",
                },
            });
            removeTestRoleId = role.id;

            const permission = await prisma.permission.create({
                data: {
                    name: "test.remove.permission",
                    description: "Permission for removal testing",
                },
            });
            removeTestPermissionId = permission.id;

            await prisma.rolePermission.create({
                data: {
                    role_id: role.id,
                    permission_id: permission.id,
                },
            });
        });

        it("should remove permission from role", async () => {
            const result = await service.removePermissionFromRole(removeTestRoleId, removeTestPermissionId);

            expect(result).toBeDefined();

            // Verify permission is removed
            const rolePermission = await prisma.rolePermission.findFirst({
                where: {
                    role_id: removeTestRoleId,
                    permission_id: removeTestPermissionId,
                },
            });
            expect(rolePermission).toBeNull();
        });

        it("should throw error for non-existent assignment", async () => {
            expect(
                async () => await service.removePermissionFromRole(removeTestRoleId, removeTestPermissionId)
            ).toThrow();
        });

        it("should throw error for non-existent role", async () => {
            const fakeRoleId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.removePermissionFromRole(fakeRoleId, removeTestPermissionId)).toThrow();
        });
    });

    describe("Integration", () => {
        it("should complete full CRUD flow", async () => {
            // 1. Create
            const createData: CreateRoleInput = {
                name: "integration_test_role",
                description: "Integration test role",
            };

            const created = await service.create(createData);
            expect(created.name).toBe(createData.name);
            if (createData.description) {
                expect(created.description).toBe(createData.description);
            }

            // 2. Find by ID
            const foundById = await service.findById(created.id);
            expect(foundById.id).toBe(created.id);
            expect(foundById.name).toBe(createData.name);

            // 3. Find by Name
            const foundByName = await service.findByName(createData.name);
            expect(foundByName).toBeDefined();
            expect(foundByName?.id).toBe(created.id);

            // 4. Update
            const updateData: UpdateRoleInput = {
                name: "updated_integration_role",
                description: "Updated integration description",
            };
            const updated = await service.update(created.id, updateData);
            expect(updated.name).toBe("updated_integration_role");
            expect(updated.description).toBe("Updated integration description");

            // 5. Get All (should include our role)
            const allRoles = await service.getAll({ search: "updated_integration_role" } as ParamsRoleSchema);
            expect(allRoles.data.length).toBeGreaterThanOrEqual(1);
            const ourRole = allRoles.data.find((r) => r.id === created.id);
            expect(ourRole).toBeDefined();
            expect(ourRole?.name).toBe("updated_integration_role");

            // 6. Delete
            const deleted = await service.destroy(created.id);
            expect(deleted.id).toBe(created.id);

            // 7. Verify deletion
            expect(async () => await service.findById(created.id)).toThrow();
        });
    });
});
