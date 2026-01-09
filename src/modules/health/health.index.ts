/**
 * Health Module Index File
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRouter } from "@/application/create-router";
import * as controllers from "@/modules/health/health.controller";
import * as routes from "@/modules/health/health.route";

const router = createRouter().openapi(routes.health, controllers.health);

export default router;
