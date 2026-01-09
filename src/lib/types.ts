/**
 * Type definitions for the application.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

/** biome-ignore-all lint/complexity/noBannedTypes: <because generic from OpenApiHono> */

import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Schema } from "hono";
import type { Logger } from "winston";

export interface AppBindings {
    Variables: {
        logger: Logger;
        jwtPayload: JwtPayload;
    };
}

export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;

export type Meta = {
    total: number;
    page: number;
    per_page: number;
    total_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
};

export type JwtPayload = {
    sub: string;
    exp: number;
    type?: string;
};
