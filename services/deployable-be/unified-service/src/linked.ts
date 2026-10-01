// GENERATED FILE. Do not edit by hand.
// Regenerate with: pnpm rs link-service <service-name>
import adminRouter from "admin-service/router";
import rootRouter from "root-service/router";
import formRouter from "form-service/router";
import commonAppShortUrlApiRouter from "common-app-service/short-url-api";
import { cronRouter } from "common-app-service/router";
import { redirectRouter } from "common-app-service/router";
import type { Router } from "express";

export interface LinkedRouter {
    service: string;
    mount: string;
    router: Router;
}

export const linkedRouters: LinkedRouter[] = [
    { service: "admin-service", mount: "/api/admin", router: adminRouter },
    { service: "root-service", mount: "/api", router: rootRouter },
    { service: "form-service", mount: "/api/forms", router: formRouter },
    { service: "common-app-service", mount: "/api/urls", router: commonAppShortUrlApiRouter },
    { service: "common-app-service", mount: "/api/urls", router: cronRouter },
    { service: "common-app-service", mount: "/", router: redirectRouter },
];
