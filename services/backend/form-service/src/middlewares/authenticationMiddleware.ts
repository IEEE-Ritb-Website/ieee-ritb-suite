import { NextFunction, Request, Response } from "express";

// Admin service configuration
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || "http://localhost:3001";

/**
 * Authentication middleware that validates user sessions via admin-service
 * Makes HTTP request to admin-service's /api/auth/me endpoint
 */
export async function authenticationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // Extract cookies from request to forward to admin-service
        const cookieHeader = req.headers.cookie;

        if (!cookieHeader) {
            return res.status(401).json({
                success: false,
                error: {
                    type: "authentication",
                    message: "Unauthorized - No session cookie found",
                },
            });
        }

        // Call admin-service to validate session
        const response = await fetch(`${ADMIN_SERVICE_URL}/api/auth/me`, {
            method: "GET",
            headers: {
                "Cookie": cookieHeader,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return res.status(401).json({
                success: false,
                error: {
                    type: "authentication",
                    message: "Unauthorized - Invalid or expired session",
                },
            });
        }

        const session = await response.json();

        if (!session || !session.user) {
            return res.status(401).json({
                success: false,
                error: {
                    type: "authentication",
                    message: "Unauthorized - Please sign in to access this resource",
                },
            });
        }

        // Attach user session to request for use in controllers
        (req as any).session = session;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            success: false,
            error: {
                type: "server",
                message: "Authentication service unavailable",
            },
        });
    }
}
