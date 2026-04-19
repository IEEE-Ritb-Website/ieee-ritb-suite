import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
    // Generic type will help the client know about additional fields
});
