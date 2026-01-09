/**
 * Test cases for the health module.
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { beforeAll, describe, expect, it } from "bun:test";
import { Hono } from "hono";
import * as controller from "@/modules/health/health.controller";
import * as service from "@/modules/health/health.service";
import type { HealthData } from "@/modules/health/health.validation";

describe("Health Module", () => {
    describe("Service", () => {
        it("should return health status with ok status", async () => {
            const result = await service.healthIndex();

            expect(result).toBeDefined();
            expect(result.status).toBe("ok");
        });

        it("should return current timestamp in ISO format", async () => {
            const result = await service.healthIndex();

            expect(result.timestamp).toBeDefined();
            const timestamp = new Date(result.timestamp);
            expect(timestamp).toBeInstanceOf(Date);
            expect(Number.isNaN(timestamp.getTime())).toBe(false);
        });

        it("should return uptime as a positive number", async () => {
            const result = await service.healthIndex();

            expect(typeof result.uptime).toBe("number");
            expect(result.uptime).toBeGreaterThanOrEqual(0);
        });

        it("should return all required properties", async () => {
            const result = await service.healthIndex();

            expect(result).toHaveProperty("status");
            expect(result).toHaveProperty("timestamp");
            expect(result).toHaveProperty("uptime");
        });

        it("should return different uptime values on consecutive calls", async () => {
            const firstResult = await service.healthIndex();
            // Wait a bit to ensure uptime changes
            await new Promise((resolve) => setTimeout(resolve, 10));
            const secondResult = await service.healthIndex();

            expect(firstResult.uptime).toBeLessThanOrEqual(secondResult.uptime);
        });
    });

    describe("Controller", () => {
        let app: Hono;

        beforeAll(() => {
            app = new Hono();

            // Register the health route
            app.get("/api/v1/health", controller.health);
        });

        it("should return 200 OK status", async () => {
            const response = await app.request("/api/v1/health");

            expect(response.status).toBe(200);
        });

        it("should return JSON content type", async () => {
            const response = await app.request("/api/v1/health");

            expect(response.headers.get("content-type")).toContain("application/json");
        });

        it("should return valid health data structure", async () => {
            const response = await app.request("/api/v1/health");
            const data = (await response.json()) as HealthData;

            expect(data).toHaveProperty("status");
            expect(data).toHaveProperty("timestamp");
            expect(data).toHaveProperty("uptime");
        });

        it("should return status as 'ok'", async () => {
            const response = await app.request("/api/v1/health");
            const data = (await response.json()) as HealthData;

            expect(data.status).toBe("ok");
        });

        it("should return valid ISO timestamp", async () => {
            const response = await app.request("/api/v1/health");
            const data = (await response.json()) as HealthData;

            const timestamp = new Date(data.timestamp);
            expect(Number.isNaN(timestamp.getTime())).toBe(false);
        });

        it("should return uptime as a non-negative number", async () => {
            const response = await app.request("/api/v1/health");
            const data = (await response.json()) as HealthData;

            expect(typeof data.uptime).toBe("number");
            expect(data.uptime).toBeGreaterThanOrEqual(0);
        });

        it("should handle multiple consecutive requests", async () => {
            const response1 = await app.request("/api/v1/health");
            const response2 = await app.request("/api/v1/health");
            const response3 = await app.request("/api/v1/health");

            expect(response1.status).toBe(200);
            expect(response2.status).toBe(200);
            expect(response3.status).toBe(200);

            const data1 = (await response1.json()) as HealthData;
            const data2 = (await response2.json()) as HealthData;
            const data3 = (await response3.json()) as HealthData;

            expect(data1.status).toBe("ok");
            expect(data2.status).toBe("ok");
            expect(data3.status).toBe("ok");
        });
    });

    describe("Integration", () => {
        it("service and controller should work together", async () => {
            const serviceData = await service.healthIndex();
            const app = new Hono();
            app.get("/api/v1/health", controller.health);

            const response = await app.request("/api/v1/health");
            const controllerData = (await response.json()) as HealthData;

            expect(response.status).toBe(200);
            expect(controllerData.status).toBe(serviceData.status);
            expect(controllerData.timestamp).toBeDefined();
            expect(controllerData.uptime).toBeGreaterThanOrEqual(0);
        });
    });
});
