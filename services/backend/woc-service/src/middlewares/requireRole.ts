import { Request, Response, NextFunction } from "express";
import { getUserRole, type UserRole } from "@/utils/roles";
import { ForbiddenError, UnauthorizedError } from "./errorHandler";

// Server-side role gate. Must run after requireAuth. Roles come from the
// verified Supabase app_metadata (see utils/roles.ts), never from request
// bodies, query params, or any other client-controlled input.
export const requireRole = (...allowed: UserRole[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError("Missing access token");
            }
            const role = getUserRole({ app_metadata: { role: req.user.role } });
            if (!allowed.includes(role)) {
                throw new ForbiddenError("This action requires a higher role");
            }
            next();
        } catch (err) {
            next(err);
        }
    };
