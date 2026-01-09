/**
 * Controller functions for the health module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "@/lib/types";
import type { healthRoute } from "@/modules/health/health.route";
import * as service from "@/modules/health/health.service";

/**
 * Controller functions for the health module.
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 */
export const health: AppRouteHandler<healthRoute> = async (c) => {
    try {
        const data = await service.healthIndex();

        return c.json(data, HttpStatusCodes.OK);
    } catch (error) {
        return c.json(
            {
                message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : String(error),
            },
            HttpStatusCodes.INTERNAL_SERVER_ERROR
        );
    }
};
