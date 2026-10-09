import { Request, Response, NextFunction } from "express";
import { getSupabase } from "@/utils/supabase";
import { getUserRole, type UserRole } from "@/utils/roles";
import type { AuthUser } from "@/types";
import { UnauthorizedError } from "./errorHandler";

export type TokenVerifier = (token: string) => Promise<AuthUser>;

const defaultVerifier: TokenVerifier = async (token: string) => {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        throw new UnauthorizedError("Invalid or expired session");
    }
    return {
        id: data.user.id,
        email: data.user.email ?? undefined,
        role: getUserRole(data.user),
    };
};

// Factory kept injectable so unit tests can verify the middleware without
// network access. Production code uses the default `requireAuth` below.
export const createRequireAuth = (verify: TokenVerifier) =>
    async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const header = req.headers.authorization;
            const token = header?.startsWith("Bearer ")
                ? header.slice("Bearer ".length).trim()
                : undefined;

            if (!token) {
                throw new UnauthorizedError("Missing access token");
            }

            req.user = await verify(token);
            next();
        } catch (err) {
            next(err);
        }
    };

// Verifies the Supabase access token from `Authorization: Bearer <token>`
// and attaches the authenticated user to the request. Fails closed:
// missing/invalid sessions get 401, an unconfigured server gets 500.
export const requireAuth = createRequireAuth(defaultVerifier);

export type { UserRole };
