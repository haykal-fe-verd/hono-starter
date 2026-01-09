/**
 * Home routes
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { createRouter } from "@/application/create-router";
import * as HomeController from "@/modules/home/home.controller";

export const homeRoute = createRouter().get("/", HomeController.index);
