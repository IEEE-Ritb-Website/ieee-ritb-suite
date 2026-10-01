// GENERATED FILE. Do not edit by hand.
// Regenerate with: pnpm rs link-service <service-name>
import { createApi } from "./api.js";
import { AdminClient } from "./admin.js";
import { ChaptersClient } from "./chapters.js";
import { FormsClient } from "./forms.js";
import { UrlsClient } from "./urls.js";

export { createApi } from "./api.js";
export * from "./mounts.js";
export * from "./admin.js";
export * from "./chapters.js";
export * from "./forms.js";
export * from "./urls.js";

export const createUnifiedClient = (baseURL: string) => {
    const api = createApi(baseURL);
    return {
        admin: new AdminClient(api),
        chapters: new ChaptersClient(api),
        forms: new FormsClient(api),
        urls: new UrlsClient(api),
    };
};

export type UnifiedClient = ReturnType<typeof createUnifiedClient>;
