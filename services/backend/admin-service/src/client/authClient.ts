import { CONFIG } from "@/configs";
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: CONFIG.auth.baseUrl,
    plugins: [
        adminClient(),
    ],
    routes: {
        signIn: "/api/auth/sign-in",
        signUp: "/api/auth/create-chapter-admin",
    }
});
