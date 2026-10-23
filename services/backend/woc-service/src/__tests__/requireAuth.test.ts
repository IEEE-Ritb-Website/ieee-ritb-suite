import type { Request, Response, NextFunction } from "express";
import { describe, expect, it, vi } from "vitest";
import { createRequireAuth } from "@/middlewares/requireAuth";
import { UnauthorizedError } from "@/middlewares/errorHandler";

const mockRes = () => ({} as unknown as Response);

const mockReq = (authorization?: string) =>
    ({ headers: authorization ? { authorization } : {} }) as unknown as Request;

describe("requireAuth", () => {
    it("rejects requests with no Authorization header", async () => {
        const middleware = createRequireAuth(async () => {
            throw new Error("verifier must not run without a token");
        });
        const next = vi.fn() as unknown as NextFunction;
        await middleware(mockReq(), mockRes(), next);

        expect(next).toHaveBeenCalledTimes(1);
        const err = (next as unknown as { mock: { calls: unknown[][] } }).mock.calls[0]?.[0];
        expect(err).toBeInstanceOf(UnauthorizedError);
        expect((err as Error).message).toBe("Missing access token");
    });

    it("rejects malformed (non-Bearer) Authorization headers", async () => {
        const middleware = createRequireAuth(async () => {
            throw new Error("verifier must not run without a token");
        });
        const next = vi.fn() as unknown as NextFunction;
        await middleware(mockReq("Token abc123"), mockRes(), next);

        const err = (next as unknown as { mock: { calls: unknown[][] } }).mock.calls[0]?.[0];
        expect(err).toBeInstanceOf(UnauthorizedError);
    });

    it("rejects forged tokens via the verifier", async () => {
        const middleware = createRequireAuth(async () => {
            throw new UnauthorizedError("Invalid or expired session");
        });
        const next = vi.fn() as unknown as NextFunction;
        await middleware(mockReq("Bearer forged-token"), mockRes(), next);

        const err = (next as unknown as { mock: { calls: unknown[][] } }).mock.calls[0]?.[0];
        expect(err).toBeInstanceOf(UnauthorizedError);
        expect((err as Error).message).toBe("Invalid or expired session");
    });

    it("attaches the verified user and passes valid tokens", async () => {
        const middleware = createRequireAuth(async (token: string) => {
            if (token !== "good-token") throw new UnauthorizedError("Invalid or expired session");
            return { id: "user-1", email: "mentor@ritb.edu", role: "mentor" as const };
        });
        const req = mockReq("Bearer good-token");
        const next = vi.fn() as unknown as NextFunction;
        await middleware(req, mockRes(), next);

        expect(next).toHaveBeenCalledWith();
        expect(req.user).toEqual({ id: "user-1", email: "mentor@ritb.edu", role: "mentor" });
    });
});
