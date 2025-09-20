import { CONFIG } from "@/configs";
import { mongodbClient } from "@/db";
import { getAstraLogger } from "astralogger";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { fromNodeHeaders } from "better-auth/node";
import { admin } from "better-auth/plugins";
import { Request } from "express";
import z from "zod";

// REFERENCE: https://www.better-auth.com/docs/plugins/admin
export const auth = betterAuth({
    database: mongodbAdapter(mongodbClient.getDb()),
    emailAndPassword: {
        enabled: true,
        disableSignUp: true,    // do not allow anyone to sign up themselves. only admin can onboard new user
    },
    plugins: [
        admin()
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "head",
                input: false,
            },
            chapter: {
                type: "string",
                required: true,
                input: true,
            }
        },
    },
    trustedOrigins: [CONFIG.auth.trustedOrigins],
});

// Use this function to create an admin if does not exist
export async function createAdmin() {
    try {
        await auth.api.createUser({
            body: {
                email: "admin@example.com",
                password: "password123",
                name: "Admin",
                role: "admin",
                data: {
                    chapter: "Student Branch"
                }
            }
        });
        getAstraLogger().info("Admin user created successfully")
    } catch (error) {
        getAstraLogger().fatal(`Error creating admin user: ${error}`);
    }
}

export const getAuthContext = async (headers: Request["headers"]) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(headers),
    });
    return session;
}