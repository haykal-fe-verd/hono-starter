/**
 * Router registration for the permissions module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRouter } from "@/application/create-router";
import * as handlers from "@/modules/permissions/permissions.controller";
import * as routes from "@/modules/permissions/permissions.route";

const router = createRouter()
    .openapi(routes.index, handlers.index)
    .openapi(routes.store, handlers.store)
    .openapi(routes.show, handlers.show)
    .openapi(routes.update, handlers.update)
    .openapi(routes.destroy, handlers.destroy)
    .openapi(routes.getRolesByPermission, handlers.getRolesByPermission)
    .openapi(routes.getUsersByPermission, handlers.getUsersByPermission)
    .openapi(routes.assignPermissionToUser, handlers.assignToUser)
    .openapi(routes.removePermissionFromUser, handlers.removeFromUser);

export default router;
