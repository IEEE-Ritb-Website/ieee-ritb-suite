import type { Request, Response, NextFunction } from "express";
import { describe, expect, it, vi } from "vitest";
import { requireRole } from "@/middlewares/requireRole";
import { ForbiddenError, UnauthorizedError } from "@/middlewares/errorHandler";
import type { AuthUser } from "@/types";

const mockRes = () => ({} as unknown as Response);

const mockReq = (user?: AuthUser) =>
    ({ user, headers: {} }) as unknown as Request;

const nextError = (next: NextFunction): unknown =>
    (next as unknown as { mock: { calls: unknown[][] } }).mock.calls[0]?.[0];

describe("requireRole", () => {
    it("rejects requests with no authenticated user", () => {
        const next = vi.fn() as unknown as NextFunction;
        requireRole("mentor", "admin")(mockReq(undefined), mockRes(), next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(nextError(next)).toBeInstanceOf(UnauthorizedError);
    });

    it("rejects participants from mentor-only routes", () => {
        const next = vi.fn() as unknown as NextFunction;
        requireRole("mentor", "admin")(
            mockReq({ id: "u1", role: "participant" }),
            mockRes(),
            next,
        );

        expect(nextError(next)).toBeInstanceOf(ForbiddenError);
    });

    it("allows mentors on mentor routes", () => {
        const next = vi.fn() as unknown as NextFunction;
        requireRole("mentor", "admin")(
            mockReq({ id: "u1", email: "m@ritb.edu", role: "mentor" }),
            mockRes(),
            next,
        );

        expect(next).toHaveBeenCalledWith();
    });

    it("allows admins on mentor routes", () => {
        const next = vi.fn() as unknown as NextFunction;
        requireRole("mentor", "admin")(
            mockReq({ id: "u1", role: "admin" }),
            mockRes(),
            next,
        );

        expect(next).toHaveBeenCalledWith();
    });

    it("rejects mentors from admin-only routes", () => {
        const next = vi.fn() as unknown as NextFunction;
        requireRole("admin")(mockReq({ id: "u1", role: "mentor" }), mockRes(), next);

        expect(nextError(next)).toBeInstanceOf(ForbiddenError);
    });
});
