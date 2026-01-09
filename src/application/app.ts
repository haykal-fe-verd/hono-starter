/**
 * App Module
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createApp } from "@/application/create-app";
import { createOpenAPI } from "@/application/create-open-api";
import auth from "@/modules/auth/auth.index";
import health from "@/modules/health/health.index";
import { homeRoute } from "@/modules/home/home.index";
import permission from "@/modules/permissions/permissions.index";
import role from "@/modules/roles/roles.index";
import user from "@/modules/users/users.index";

// Create App Instance
const app = createApp();

// Create OpenAPI Instance
createOpenAPI(app);

// Define Routes
const routes = [homeRoute, health, auth, role, permission, user];

// Register Routes
routes.forEach((route) => {
    app.route("/", route);
});

export type AppType = (typeof routes)[number];

export default app;
