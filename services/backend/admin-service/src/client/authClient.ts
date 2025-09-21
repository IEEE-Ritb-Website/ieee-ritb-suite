import { CONFIG } from "@/configs";
import { createAuthClient } from "better-auth/client";
import { adminClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: CONFIG.auth.baseUrl,
    plugins: [
        adminClient(),
        organizationClient(),
    ],
});
