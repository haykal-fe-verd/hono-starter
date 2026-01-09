/**
 * Database seeding script.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

/** biome-ignore-all lint/style/noNonNullAssertion: <because seeder> */

import { disconnectDb, prisma } from "./db";
import { DEFAULT_ROLES, getDefaultPermissions, getDefaultRoles } from "./factory/role-permission";
import { userFactory } from "./factory/user";

/**
 * Main seeding function.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 */
async function main() {
    console.log("🌱 Seeding database...");

    //! Clear existing data
    await prisma.userPermission.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.permission.deleteMany();
    console.log("🗑️  Cleared existing data");

    //! Seed Permissions
    const permissions = await prisma.permission.createManyAndReturn({
        data: getDefaultPermissions(),
    });
    console.log(`✅ Created ${permissions.length} permissions`);

    //! Seed Roles
    const roles = await prisma.role.createManyAndReturn({
        data: getDefaultRoles(),
    });
    console.log(`✅ Created ${roles.length} roles`);

    //! Get created roles and permissions
    const adminRole = roles.find((r) => r.name === DEFAULT_ROLES.ADMIN.name)!;
    const userRole = roles.find((r) => r.name === DEFAULT_ROLES.USER.name)!;

    //! Assign all permissions to Admin
    await prisma.rolePermission.createMany({
        data: permissions.map((p) => ({
            role_id: adminRole.id,
            permission_id: p.id,
        })),
    });

    //! Assign read permissions to User role
    const readPermissions = permissions.filter((p) => p.name.includes(".read"));
    await prisma.rolePermission.createMany({
        data: readPermissions.map((p) => ({
            role_id: userRole.id,
            permission_id: p.id,
        })),
    });

    console.log("✅ Assigned permissions to roles");

    //! Seed Admin User
    const adminUser = await prisma.user.create({
        data: await userFactory({
            name: "Admin User",
            email: "admin@admin.com",
            password: "password",
            email_verified_at: new Date(),
        }),
    });

    await prisma.userRole.create({
        data: {
            user_id: adminUser.id,
            role_id: adminRole.id,
        },
    });

    console.log(`✅ Created Admin: ${adminUser.email}`);

    //! Seed Regular User
    const regularUser = await prisma.user.create({
        data: await userFactory({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "StrongPassword123",
            email_verified_at: new Date(),
        }),
    });

    await prisma.userRole.create({
        data: {
            user_id: regularUser.id,
            role_id: userRole.id,
        },
    });

    console.log(`✅ Created Regular User: ${regularUser.email}`);

    console.log("✨ Seeding completed!");
}

/**
 * Main seeding execution.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 */
main()
    .then(async () => {
        await disconnectDb();
    })
    .catch(async (e) => {
        console.error("❌ Error during seeding:", e);
        await disconnectDb();
        process.exit(1);
    });
