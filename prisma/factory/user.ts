import { faker } from "@faker-js/faker";
import { hashPassword } from "@/lib/utils";
import type { Prisma } from "../generated/client";

export interface UserFactoryOptions {
    name?: string;
    email?: string;
    password?: string;
    email_verified_at?: Date | null;
    avatar?: string | null;
}

export const userFactory = async (options?: UserFactoryOptions): Promise<Prisma.UserCreateInput> => {
    const passwordHash = await hashPassword(options?.password ?? "Password123!");
    return {
        name: options?.name ?? faker.person.fullName(),
        email: options?.email ?? faker.internet.email().toLowerCase(),
        password: passwordHash,
        email_verified_at: options?.email_verified_at ?? faker.date.past(),
        avatar: options?.avatar ?? faker.image.avatar(),
    };
};

export const userFactoryMany = async (
    count: number,
    options?: UserFactoryOptions
): Promise<Prisma.UserCreateInput[]> => {
    return await Promise.all(Array.from({ length: count }, () => userFactory(options)));
};
