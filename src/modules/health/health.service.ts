/**
 * Service functions for the health module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import type { HealthData } from "@/modules/health/health.validation";

/**
 * Health index service
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @returns {Promise<HealthData>}
 */
export const healthIndex = async (): Promise<HealthData> => {
    const health: HealthData = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
    };

    return health;
};
