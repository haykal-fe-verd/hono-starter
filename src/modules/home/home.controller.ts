/**
 * Home controller
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import type { Context } from "hono";
import * as HomeService from "@/modules/home/home.service";

/**
 * Get home page
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */
export const index = async (c: Context) => {
    const html = HomeService.getHomePageHTML();
    return c.html(html);
};
