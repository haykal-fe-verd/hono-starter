/**
 * Roles Module Index File
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRouter } from "@/application/create-router";
import * as controllers from "@/modules/roles/roles.controller";
import * as routes from "@/modules/roles/roles.route";

const router = createRouter()
    .openapi(routes.index, controllers.index)
    .openapi(routes.store, controllers.store)
    .openapi(routes.update, controllers.update)
    .openapi(routes.show, controllers.show)
    .openapi(routes.destroy, controllers.destroy)
    .openapi(routes.users, controllers.getUsersByRole)
    .openapi(routes.assignRole, controllers.assignRole)
    .openapi(routes.removeRole, controllers.removeRole)
    .openapi(routes.assignPermission, controllers.assignPermission)
    .openapi(routes.removePermission, controllers.removePermission);

export default router;
