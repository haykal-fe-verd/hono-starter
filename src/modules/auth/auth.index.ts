/**
 * Auth Module Index File
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRouter } from "@/application/create-router";
import * as controllers from "@/modules/auth/auth.controller";
import * as routes from "@/modules/auth/auth.route";

const router = createRouter()
    .openapi(routes.login, controllers.login)
    .openapi(routes.refresh, controllers.refresh)
    .openapi(routes.logout, controllers.logout)
    .openapi(routes.profile, controllers.profile);

export default router;
