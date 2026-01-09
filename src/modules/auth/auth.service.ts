/**
 * Service functions for the auth module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { generateAccessToken, generateRefreshToken, verifyPassword, verifyRefreshToken } from "@/lib/utils";
import type {
    LoginDataSchema,
    LoginSchema,
    ProfileDataSchema,
    RefreshDataSchema,
    RefreshTokenSchema,
} from "@/modules/auth/auth.validation";
import * as UserService from "@/modules/users/users.service";

/**
 * Login service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {LoginSchema} data
 *
 * @returns {Promise<LoginDataSchema>}
 */
export const login = async (data: LoginSchema): Promise<LoginDataSchema> => {
    const { email, password } = data;

    const foundUser = await UserService.findByEmail(email);

    if (!foundUser) {
        throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
            message: "Invalid email or password",
        });
    }

    const validatePassword = await verifyPassword(password, foundUser.password);

    if (!validatePassword) {
        throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
            message: "Invalid email or password",
        });
    }

    const accessToken = await generateAccessToken(foundUser.id);
    const refreshToken = await generateRefreshToken(foundUser.id);

    const transformedUser = await UserService.findById(foundUser.id);

    if (!transformedUser) {
        throw new HTTPException(HttpStatusCodes.INTERNAL_SERVER_ERROR, {
            message: "Failed to retrieve user data",
        });
    }

    return {
        user: transformedUser,
        access_token: accessToken,
        refresh_token: refreshToken,
    };
};

/**
 * Refresh Service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {RefreshTokenSchema} data
 *
 * @returns {Promise<RefreshDataSchema>}
 */
export const refresh = async (data: RefreshTokenSchema): Promise<RefreshDataSchema> => {
    const decode = await verifyRefreshToken(data.refresh_token);

    if (!decode) {
        throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
            message: "Invalid refresh token",
        });
    }

    const newAccessToken = await generateAccessToken(decode.sub);

    return {
        access_token: newAccessToken,
    };
};

/**
 * Logout Service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id_user
 *
 * @returns {Promise<ProfileDataSchema>}
 */
export const logout = async (id_user: string): Promise<ProfileDataSchema> => {
    const foundUser = await UserService.findById(id_user);

    if (!foundUser) {
        throw new HTTPException(HttpStatusCodes.NOT_FOUND, {
            message: "User not found",
        });
    }

    return foundUser;
};

/**
 * Profile Service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} id_user
 *
 * @returns {Promise<ProfileDataSchema>}
 */
export const profile = async (id_user: string): Promise<ProfileDataSchema> => {
    const foundUser = await UserService.findById(id_user);

    return foundUser;
};
