/**
 * Test cases for the users module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { disconnectDb, prisma } from "@prisma/db";
import { hashPassword } from "@/lib/utils";
import * as service from "@/modules/users/users.service";
import type { CreateUserInput, ParamsUserSchema, UpdateUserInput } from "@/modules/users/users.validation";

describe("Users Module", () => {
    let testUserId: string;
    let testUserEmail: string;

    beforeAll(async () => {
        // Create test role and permission
        const role = await prisma.role.create({
            data: {
                name: "test-user-role",
                description: "Test role for users module",
            },
        });

        const permission = await prisma.permission.create({
            data: {
                name: "test.user.permission",
                description: "Test permission for users module",
            },
        });

        // Link role with permission
        await prisma.rolePermission.create({
            data: {
                role_id: role.id,
                permission_id: permission.id,
            },
        });

        // Create test user
        testUserEmail = "testuser@users.com";
        const hashedPassword = await hashPassword("TestPassword123!");

        const user = await prisma.user.create({
            data: {
                name: "Test User",
                email: testUserEmail,
                password: hashedPassword,
                email_verified_at: new Date(),
            },
        });
        testUserId = user.id;

        // Assign role to user
        await prisma.userRole.create({
            data: {
                user_id: user.id,
                role_id: role.id,
            },
        });
    });

    afterAll(async () => {
        // Cleanup test data
        await prisma.userPermission.deleteMany({});
        await prisma.userRole.deleteMany({});
        await prisma.user.deleteMany({ where: { email: { contains: "@users.com" } } });
        await prisma.rolePermission.deleteMany({});
        await prisma.permission.deleteMany({ where: { name: { contains: "test.user" } } });
        await prisma.role.deleteMany({ where: { name: { contains: "test-user" } } });
        await disconnectDb();
    });

    describe("Service - getAll", () => {
        it("should get all users with default pagination", async () => {
            const params = {} as ParamsUserSchema;

            const result = await service.getAll(params);

            expect(result).toBeDefined();
            expect(result.data).toBeArray();
            expect(result.meta).toBeDefined();
            expect(result.meta.page).toBe(1);
            expect(result.meta.per_page).toBe(10);
        });

        it("should get users with custom pagination", async () => {
            const params = {
                page: 1,
                per_page: 5,
            } as ParamsUserSchema;

            const result = await service.getAll(params);

            expect(result.meta.page).toBe(1);
            expect(result.meta.per_page).toBe(5);
            expect(result.data.length).toBeLessThanOrEqual(5);
        });

        it("should search users by name", async () => {
            const params = {
                search: "Test User",
            } as ParamsUserSchema;

            const result = await service.getAll(params);

            expect(result.data).toBeArray();
            expect(result.data.length).toBeGreaterThanOrEqual(1);
            expect(result.data[0].name).toContain("Test User");
        });

        it("should search users by email", async () => {
            const params = {
                search: testUserEmail,
            } as ParamsUserSchema;

            const result = await service.getAll(params);

            expect(result.data).toBeArray();
            expect(result.data.length).toBeGreaterThanOrEqual(1);
            expect(result.data[0].email).toBe(testUserEmail);
        });

        it("should sort users by name ascending", async () => {
            const params = {
                sort: "name",
                order: "asc",
            } as ParamsUserSchema;

            const result = await service.getAll(params);

            expect(result.data).toBeArray();
            if (result.data.length >= 2) {
                expect(result.data[0].name.localeCompare(result.data[1].name)).toBeLessThanOrEqual(0);
            }
        });

        it("should return users without password field", async () => {
            const params = {} as ParamsUserSchema;

            const result = await service.getAll(params);

            expect(result.data).toBeArray();
            if (result.data.length > 0) {
                expect(result.data[0]).not.toHaveProperty("password");
            }
        });

        it("should return users with roles and permissions", async () => {
            const params = {
                search: testUserEmail,
            } as ParamsUserSchema;

            const result = await service.getAll(params);

            expect(result.data.length).toBeGreaterThanOrEqual(1);
            const user = result.data[0];
            expect(user.roles).toBeArray();
            expect(user.permissions).toBeArray();
        });
    });

    describe("Service - findById", () => {
        it("should find user by id", async () => {
            const result = await service.findById(testUserId);

            expect(result).toBeDefined();
            expect(result.id).toBe(testUserId);
            expect(result.email).toBe(testUserEmail);
            expect(result.name).toBe("Test User");
        });

        it("should return user with roles and permissions", async () => {
            const result = await service.findById(testUserId);

            expect(result.roles).toBeArray();
            expect(result.roles.length).toBeGreaterThanOrEqual(1);
            expect(result.permissions).toBeArray();
            expect(result.permissions.length).toBeGreaterThanOrEqual(1);
        });

        it("should not return password field", async () => {
            const result = await service.findById(testUserId);

            expect(result).not.toHaveProperty("password");
        });

        it("should throw error for non-existent user", async () => {
            const fakeUserId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.findById(fakeUserId)).toThrow();
        });

        it("should return dates as ISO strings", async () => {
            const result = await service.findById(testUserId);

            expect(typeof result.created_at).toBe("string");
            expect(typeof result.updated_at).toBe("string");
            expect(() => new Date(result.created_at)).not.toThrow();
            expect(() => new Date(result.updated_at)).not.toThrow();
        });
    });

    describe("Service - findByEmail", () => {
        it("should find user by email", async () => {
            const result = await service.findByEmail(testUserEmail);

            expect(result).toBeDefined();
            expect(result?.email).toBe(testUserEmail);
            expect(result?.name).toBe("Test User");
        });

        it("should return user with password field", async () => {
            const result = await service.findByEmail(testUserEmail);

            expect(result).toHaveProperty("password");
            expect(result?.password).toBeDefined();
        });

        it("should return null for non-existent email", async () => {
            const result = await service.findByEmail("nonexistent@example.com");

            expect(result).toBeNull();
        });
    });

    describe("Service - create", () => {
        it("should create a new user", async () => {
            const userData: CreateUserInput = {
                name: "New Test User",
                email: "newuser@users.com",
                password: "NewPassword123!",
            };

            const result = await service.create(userData);

            expect(result).toBeDefined();
            expect(result.email).toBe(userData.email);
            expect(result.name).toBe(userData.name);
            expect(result.id).toBeDefined();

            // Verify password is hashed
            const foundUser = await service.findByEmail(userData.email);
            expect(foundUser?.password).not.toBe(userData.password);
            expect(foundUser?.password).toBeDefined();
        });

        it("should create user without password in response", async () => {
            const userData: CreateUserInput = {
                name: "Another Test User",
                email: "anotheruser@users.com",
                password: "AnotherPassword123!",
            };

            const result = await service.create(userData);

            expect(result).not.toHaveProperty("password");
        });

        it("should create user with avatar", async () => {
            const userData: CreateUserInput = {
                name: "User With Avatar",
                email: "avatar@users.com",
                password: "AvatarPassword123!",
                avatar: "https://example.com/avatar.jpg",
            };

            const result = await service.create(userData);

            expect(result.avatar).toBe("https://example.com/avatar.jpg");
        });

        it("should throw error for duplicate email", async () => {
            const userData: CreateUserInput = {
                name: "Duplicate User",
                email: testUserEmail, // Using existing email
                password: "DuplicatePassword123!",
            };

            expect(async () => await service.create(userData)).toThrow();
        });
    });

    describe("Service - update", () => {
        let updateTestUserId: string;

        beforeAll(async () => {
            const user = await prisma.user.create({
                data: {
                    name: "Update Test User",
                    email: "updatetest@users.com",
                    password: await hashPassword("UpdatePassword123!"),
                },
            });
            updateTestUserId = user.id;
        });

        it("should update user name", async () => {
            const updateData: UpdateUserInput = {
                name: "Updated Name",
            };

            const result = await service.update(updateTestUserId, updateData);

            expect(result.name).toBe("Updated Name");
            expect(result.email).toBe("updatetest@users.com");
        });

        it("should update user email", async () => {
            const updateData: UpdateUserInput = {
                email: "newemail@users.com",
            };

            const result = await service.update(updateTestUserId, updateData);

            expect(result.email).toBe("newemail@users.com");
        });

        it("should update user password and hash it", async () => {
            const updateData: UpdateUserInput = {
                password: "NewPassword456!",
            };

            const result = await service.update(updateTestUserId, updateData);

            expect(result).not.toHaveProperty("password");

            // Verify password is hashed
            const foundUser = await service.findByEmail(result.email);
            expect(foundUser?.password).not.toBe(updateData.password);
            expect(foundUser?.password).toBeDefined();
        });

        it("should update user avatar", async () => {
            const updateData: UpdateUserInput = {
                avatar: "https://example.com/new-avatar.jpg",
            };

            const result = await service.update(updateTestUserId, updateData);

            expect(result.avatar).toBe("https://example.com/new-avatar.jpg");
        });

        it("should update multiple fields at once", async () => {
            const updateData: UpdateUserInput = {
                name: "Multi Update Name",
                email: "multiupdate@users.com",
                avatar: "https://example.com/multi-avatar.jpg",
            };

            const result = await service.update(updateTestUserId, updateData);

            expect(result.name).toBe("Multi Update Name");
            expect(result.email).toBe("multiupdate@users.com");
            expect(result.avatar).toBe("https://example.com/multi-avatar.jpg");
        });

        it("should throw error for non-existent user", async () => {
            const fakeUserId = "00000000-0000-0000-0000-000000000000";
            const updateData: UpdateUserInput = {
                name: "Should Fail",
            };

            expect(async () => await service.update(fakeUserId, updateData)).toThrow();
        });
    });

    describe("Service - destroy", () => {
        it("should delete user", async () => {
            const user = await prisma.user.create({
                data: {
                    name: "Delete Test User",
                    email: "deletetest@users.com",
                    password: await hashPassword("DeletePassword123!"),
                },
            });

            const result = await service.destroy(user.id);

            expect(result).toBeDefined();
            expect(result.id).toBe(user.id);
            expect(result.email).toBe("deletetest@users.com");

            // Verify user is deleted
            const foundUser = await prisma.user.findUnique({ where: { id: user.id } });
            expect(foundUser).toBeNull();
        });

        it("should throw error for non-existent user", async () => {
            const fakeUserId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.destroy(fakeUserId)).toThrow();
        });

        it("should return deleted user data without password", async () => {
            const user = await prisma.user.create({
                data: {
                    name: "Delete Return Test User",
                    email: "deletereturn@users.com",
                    password: await hashPassword("DeleteReturnPassword123!"),
                },
            });

            const result = await service.destroy(user.id);

            expect(result).not.toHaveProperty("password");
            expect(result.name).toBe("Delete Return Test User");
        });
    });

    describe("Integration", () => {
        it("should complete full CRUD flow", async () => {
            // 1. Create
            const createData: CreateUserInput = {
                name: "Integration Test User",
                email: "integration@users.com",
                password: "IntegrationPassword123!",
            };

            const created = await service.create(createData);
            expect(created.email).toBe(createData.email);
            expect(created.name).toBe(createData.name);

            // 2. Find by ID
            const foundById = await service.findById(created.id);
            expect(foundById.id).toBe(created.id);
            expect(foundById.email).toBe(createData.email);

            // 3. Find by Email
            const foundByEmail = await service.findByEmail(createData.email);
            expect(foundByEmail).toBeDefined();
            expect(foundByEmail?.id).toBe(created.id);

            // 4. Update
            const updateData: UpdateUserInput = {
                name: "Updated Integration User",
            };
            const updated = await service.update(created.id, updateData);
            expect(updated.name).toBe("Updated Integration User");
            expect(updated.email).toBe(createData.email);

            // 5. Get All (should include our user)
            const allUsers = await service.getAll({ search: "integration@users.com" } as ParamsUserSchema);
            expect(allUsers.data.length).toBeGreaterThanOrEqual(1);
            const ourUser = allUsers.data.find((u) => u.id === created.id);
            expect(ourUser).toBeDefined();
            expect(ourUser?.name).toBe("Updated Integration User");

            // 6. Delete
            const deleted = await service.destroy(created.id);
            expect(deleted.id).toBe(created.id);

            // 7. Verify deletion
            expect(async () => await service.findById(created.id)).toThrow();
        });
    });
});
