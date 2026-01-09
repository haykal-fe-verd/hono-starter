/**
 * Create OpenAPI Module
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { Scalar } from "@scalar/hono-api-reference";
import env from "@/application/env";
import type { AppOpenAPI } from "@/lib/types";
import { toTitleCase } from "@/lib/utils";
import packageJSON from "../../package.json" with { type: "json" };

/**
 * Create an Open Api Instance
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {AppOpenAPI} app
 *
 * @returns {void}
 */
export function createOpenAPI(app: AppOpenAPI) {
	app.doc("/openapi", {
		openapi: "3.0.0",
		info: {
			title: toTitleCase(packageJSON.name),
			version: packageJSON.version,
			description: packageJSON.description,
			contact: {
				name: packageJSON.author.name,
				url: packageJSON.author.url,
				email: packageJSON.author.email,
			},
			license: {
				name: packageJSON.license,
				url: `${packageJSON.homepage}?tab=MIT-1-ov-file`,
			},
		},
		servers: [
			{
				url: `http://localhost:${env.PORT}`,
				description: `Local server running on port ${env.PORT}`,
			},
		],
		externalDocs: {
			description: "Hono Starter Documentation",
			url: packageJSON.homepage,
		},
	});

	app.get(
		"/docs",
		Scalar({
			url: "/openapi",
			pageTitle: toTitleCase(packageJSON.name),
			title: toTitleCase(packageJSON.name),
			favicon: "🔥",
			theme: "laserwave",
			layout: "classic",
			defaultHttpClient: {
				targetKey: "js",
				clientKey: "fetch",
			},
			authentication: {
				preferredSecurityScheme: "bearerAuth",
			},
		}),
	);
}
