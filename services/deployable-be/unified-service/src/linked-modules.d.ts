// GENERATED FILE. Do not edit by hand.
// Regenerate with: pnpm rs link-service <service-name>
declare module "admin-service/router" {
    const router: import("express").Router;
    export default router;
}
declare module "root-service/router" {
    const router: import("express").Router;
    export default router;
}
declare module "form-service/router" {
    const router: import("express").Router;
    export default router;
}
declare module "common-app-service/short-url-api" {
    const router: import("express").Router;
    export default router;
}
declare module "common-app-service/router" {
    const router: import("express").Router;
    export default router;
    export const cronRouter: import("express").Router;
    export const redirectRouter: import("express").Router;
}
declare module "form-service/db" {
    export const connectToDatabase: () => Promise<import("mongodb").Db>;
    export const getDb: () => import("mongodb").Db;
}
