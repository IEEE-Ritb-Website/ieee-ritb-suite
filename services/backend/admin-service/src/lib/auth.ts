import { CONFIG } from "@/configs";
import { mongodbClient } from "@/db";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { fromNodeHeaders } from "better-auth/node";
import { admin, organization } from "better-auth/plugins";
import { Request } from "express";
import { member, orgAdmin, rootAdmin } from "./auth/permissions";

// REFERENCE: https://www.better-auth.com/docs/plugins/admin
export const auth = betterAuth({
    database: mongodbAdapter(mongodbClient.getDb()),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin({
            roles: {
                member,
                orgAdmin,
                rootAdmin,
            },
            defaultRole: "member",
        }),
        organization({
            allowUserToCreateOrganization: async (user) => {
                return user.role === "rootAdmin";   // Only allow the root admins to create organizations
            },
            sendInvitationEmail: async (data) => {
                console.log(`Sending invitation to ${data.email} for organization: ${data.organization.name}`);
            },
            roles: {
                member,
                orgAdmin,
                rootAdmin,
            },
            creatorRole: "rootAdmin",
            schema: {
                organization: {
                    additionalFields: {
                        // organizationType: `student-branch` or `chapter`
                        organizationLevel: {
                            type: "string",
                            defaultValue: "chapter",
                        },
                        // type: `tech` or `non-tech`
                        type: {
                            type: "string",
                            required: false,
                        },
                        parentOrganizationId: {
                            type: "string",
                            required: false,
                        },
                        shortDescription: {
                            type: "string",
                            required: true,
                        },
                        faculty: {
                            type: "string",
                            required: false,
                        },
                        facultyImage: {
                            type: "string",
                            required: false,
                        }
                    }
                }
            }
        }),
    ],
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false, // Set to false if some users might not have it yet
            },
            department: {
                type: "string",
                required: false,
            },
            usn: {
                type: "string",
                required: false,
            },
            role: {
                type: "string",
                defaultValue: "member",
            },
            membershipId: {
                type: "string",
                required: false,
            },
            // TODO: Implement user positions
            positions: {
                type: "json",
                defaultValue: [],
            },
            tagline: {
                type: "string",
                required: false,
            },
            bio: {
                type: "string",
                required: false,
            },
            github: {
                type: "string",
                required: false,
            },
            linkedin: {
                type: "string",
                required: false,
            },
            website: {
                type: "string",
                required: false,
            },
            leetcode: {
                type: "string",
                required: false,
            },
            devpost: {
                type: "string",
                required: false,
            },
            chapters: {
                type: "string[]",
                required: false,
            },
            batch: {
                type: "string",
                required: false,
            },
            year: {
                type: "string",
                required: false,
            }
        }
    },
    trustedOrigins: [CONFIG.auth.trustedOrigins],
});

export const getAuthContext = async (headers: Request["headers"]) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(headers),
    });
    return session;
}