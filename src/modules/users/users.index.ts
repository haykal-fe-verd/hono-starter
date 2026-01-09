/**
 * Users Module Index File
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRouter } from "@/application/create-router";
import * as controllers from "@/modules/users/users.controller";
import * as routes from "@/modules/users/users.route";

const router = createRouter()
    .openapi(routes.index, controllers.index)
    .openapi(routes.store, controllers.store)
    .openapi(routes.update, controllers.update)
    .openapi(routes.show, controllers.show)
    .openapi(routes.destroy, controllers.destroy);

export default router;
