/**
 * Test cases for the auth module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { disconnectDb, prisma } from "@prisma/db";
import { sign } from "hono/jwt";
import env from "@/application/env";
import { hashPassword } from "@/lib/utils";
import * as service from "@/modules/auth/auth.service";
import type { LoginSchema, RefreshTokenSchema } from "@/modules/auth/auth.validation";

describe("Auth Module", () => {
    let testUserId: string;
    let testUserEmail: string;
    let testUserPassword: string;
    let testAccessToken: string;
    let testRefreshToken: string;

    beforeAll(async () => {
        // Create test user with role and permissions
        testUserEmail = "testuser@example.com";
        testUserPassword = "TestPassword123!";
        const hashedPassword = await hashPassword(testUserPassword);

        // Create role and permission
        const role = await prisma.role.create({
            data: {
                name: "test-role",
                description: "Test role for testing",
            },
        });

        const permission = await prisma.permission.create({
            data: {
                name: "test.permission",
                description: "Test permission",
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

        // Generate test tokens
        testAccessToken = await sign(
            {
                sub: testUserId,
                exp: Math.floor(Date.now() / 1000) + Number(env.JWT_EXPIRES_IN) / 1000,
            },
            env.JWT_SECRET
        );

        testRefreshToken = await sign(
            {
                sub: testUserId,
                type: "refresh",
                exp: Math.floor(Date.now() / 1000) + Number(env.REFRESH_TOKEN_EXPIRES_IN) / 1000,
            },
            env.REFRESH_TOKEN_SECRET
        );
    });

    afterAll(async () => {
        // Cleanup test data
        await prisma.userRole.deleteMany({ where: { user_id: testUserId } });
        await prisma.rolePermission.deleteMany({});
        await prisma.user.deleteMany({ where: { email: testUserEmail } });
        await prisma.permission.deleteMany({ where: { name: "test.permission" } });
        await prisma.role.deleteMany({ where: { name: "test-role" } });
        await disconnectDb();
    });

    describe("Service - Login", () => {
        it("should successfully login with valid credentials", async () => {
            const loginData: LoginSchema = {
                email: testUserEmail,
                password: testUserPassword,
            };

            const result = await service.login(loginData);

            expect(result).toBeDefined();
            expect(result.user).toBeDefined();
            expect(result.user.email).toBe(testUserEmail);
            expect(result.user.name).toBe("Test User");
            expect(result.access_token).toBeDefined();
            expect(result.refresh_token).toBeDefined();
            expect(result.user.roles).toBeArray();
            expect(result.user.permissions).toBeArray();
        });

        it("should return user with roles and permissions", async () => {
            const loginData: LoginSchema = {
                email: testUserEmail,
                password: testUserPassword,
            };

            const result = await service.login(loginData);

            expect(result.user.roles).toHaveLength(1);
            expect(result.user.roles[0].name).toBe("test-role");
            expect(result.user.permissions).toHaveLength(1);
            expect(result.user.permissions[0].name).toBe("test.permission");
        });

        it("should throw error for invalid email", async () => {
            const loginData: LoginSchema = {
                email: "invalid@example.com",
                password: testUserPassword,
            };

            expect(async () => await service.login(loginData)).toThrow();
        });

        it("should throw error for invalid password", async () => {
            const loginData: LoginSchema = {
                email: testUserEmail,
                password: "WrongPassword123!",
            };

            expect(async () => await service.login(loginData)).toThrow();
        });

        it("should not return password in response", async () => {
            const loginData: LoginSchema = {
                email: testUserEmail,
                password: testUserPassword,
            };

            const result = await service.login(loginData);

            expect(result.user).not.toHaveProperty("password");
        });
    });

    describe("Service - Refresh", () => {
        it("should successfully refresh access token", async () => {
            const refreshData: RefreshTokenSchema = {
                refresh_token: testRefreshToken,
            };

            const result = await service.refresh(refreshData);

            expect(result).toBeDefined();
            expect(result.access_token).toBeDefined();
            expect(typeof result.access_token).toBe("string");
        });

        it("should throw error for invalid refresh token", async () => {
            const refreshData: RefreshTokenSchema = {
                refresh_token: "invalid.token.here",
            };

            expect(async () => await service.refresh(refreshData)).toThrow();
        });

        it("should throw error for access token used as refresh token", async () => {
            const refreshData: RefreshTokenSchema = {
                refresh_token: testAccessToken,
            };

            expect(async () => await service.refresh(refreshData)).toThrow();
        });
    });

    describe("Service - Profile", () => {
        it("should successfully get user profile", async () => {
            const result = await service.profile(testUserId);

            expect(result).toBeDefined();
            expect(result.id).toBe(testUserId);
            expect(result.email).toBe(testUserEmail);
            expect(result.name).toBe("Test User");
            expect(result.roles).toBeArray();
            expect(result.permissions).toBeArray();
        });

        it("should return user with roles and permissions", async () => {
            const result = await service.profile(testUserId);

            expect(result.roles).toHaveLength(1);
            expect(result.roles[0].name).toBe("test-role");
            expect(result.permissions).toHaveLength(1);
            expect(result.permissions[0].name).toBe("test.permission");
        });

        it("should throw error for non-existent user", async () => {
            const fakeUserId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.profile(fakeUserId)).toThrow();
        });

        it("should not return password in profile", async () => {
            const result = await service.profile(testUserId);

            expect(result).not.toHaveProperty("password");
        });
    });

    describe("Service - Logout", () => {
        it("should successfully logout and return user profile", async () => {
            const result = await service.logout(testUserId);

            expect(result).toBeDefined();
            expect(result.id).toBe(testUserId);
            expect(result.email).toBe(testUserEmail);
        });

        it("should throw error for non-existent user", async () => {
            const fakeUserId = "00000000-0000-0000-0000-000000000000";

            expect(async () => await service.logout(fakeUserId)).toThrow();
        });
    });

    describe("Integration", () => {
        it("should complete full authentication flow", async () => {
            // 1. Login
            const loginResult = await service.login({
                email: testUserEmail,
                password: testUserPassword,
            });

            expect(loginResult.access_token).toBeDefined();
            expect(loginResult.refresh_token).toBeDefined();

            // 2. Get Profile
            const profileResult = await service.profile(testUserId);

            expect(profileResult.id).toBe(testUserId);
            expect(profileResult.email).toBe(testUserEmail);

            // 3. Refresh Token
            const refreshResult = await service.refresh({
                refresh_token: loginResult.refresh_token,
            });

            expect(refreshResult.access_token).toBeDefined();

            // 4. Logout
            const logoutResult = await service.logout(testUserId);

            expect(logoutResult.id).toBe(testUserId);
        });
    });
});
