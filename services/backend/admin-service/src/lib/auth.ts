import { CONFIG } from "@/configs";
import { mongodbClient } from "@/db";
import { Chapters } from "@astranova/catalogues";
import { getAstraLogger } from "astralogger";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getHeaders } from "better-auth/client";
import { fromNodeHeaders } from "better-auth/node";
import { admin, organization } from "better-auth/plugins";
import { Request } from "express";
import z from "zod";

export const UserRoleSchema = z.object({
    role: z.string(),
    position: z.string(),
    chapter: z.string().optional(),
})

// REFERENCE: https://www.better-auth.com/docs/plugins/admin
export const auth = betterAuth({
    database: mongodbAdapter(mongodbClient.getDb()),
    emailAndPassword: {
        enabled: true,
        disableSignUp: true,    // do not allow anyone to sign up themselves. only admin can onboard new user
    },
    plugins: [
        admin(),
        organization({
            allowUserToCreateOrganization: async (user) => {
                const getUserRole = "admin";    // TODO: fix this to get user role to create an organization (only allow admins)
                return getUserRole === "admin";
            }
        })
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: false,
            }
        }
    },
    trustedOrigins: [CONFIG.auth.trustedOrigins],
});

export async function createOrganizations() {
    try {
        const ctx = await auth.api.signInEmail({
            body: {
                email: "shivesh@example.com",
                password: "password123",
            },
            returnHeaders: true,
        })
        for (let chapter of Chapters) {
            await auth.api.createOrganization({
                body: {
                    name: chapter.name,
                    slug: chapter.name.toLowerCase().trim().replace(/\s+/g, "-"),
                    logo: chapter.imagePath,
                },
            })
        }
    } catch (error) {
        getAstraLogger().fatal(`Error creating organizations: ${error}`);
    }
}

createOrganizations();

// Use this function to create an admin if does not exist
export async function createAdmin() {
    try {
        await auth.api.createUser({
            body: {
                email: "shivesh@example.com",
                password: "password123",
                name: "Admin",
                role: "admin",
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