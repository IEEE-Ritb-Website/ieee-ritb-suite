export type UserRole = "admin" | "mentor" | "participant";

const KNOWN_ROLES: readonly string[] = ["admin", "mentor", "participant"];

// Roles are assigned in the Supabase dashboard via the user's app_metadata
// (`{ "role": "mentor" }`). app_metadata is signed into the JWT by Supabase
// and cannot be forged by the user, unlike user_metadata. Unknown or
// missing roles fall back to the least-privileged participant role.
export const getUserRole = (
    user: { app_metadata?: Record<string, unknown> | null } | null | undefined,
): UserRole => {
    const raw = user?.app_metadata?.["role"];
    if (typeof raw === "string" && (KNOWN_ROLES as readonly string[]).includes(raw)) {
        return raw as UserRole;
    }
    return "participant";
};
