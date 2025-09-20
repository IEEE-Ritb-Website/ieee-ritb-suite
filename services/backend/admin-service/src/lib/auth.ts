import { CONFIG } from "@/configs";
import { mongodbClient } from "@/db";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { fromNodeHeaders } from "better-auth/node";
import { Request } from "express";

export const auth = betterAuth({
    database: mongodbAdapter(mongodbClient.getDb()),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    },
    trustedOrigins: [CONFIG.auth.trustedOrigins],
    user: {
        deleteUser: {
            enabled: true,
        },
    },
});

export const getAuthContext = async (headers: Request["headers"]) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(headers),
    });
    return session;
}