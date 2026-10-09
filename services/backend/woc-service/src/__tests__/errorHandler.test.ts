import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import {
    ConflictError,
    errorHandler,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
} from "@/middlewares/errorHandler";
import { OrganizationSchema } from "@/schemas/organization";

type Captured = { statusCode?: number; body?: unknown };

const mockRes = (captured: Captured) =>
    ({
        status(code: number) {
            captured.statusCode = code;
            return this;
        },
        json(body: unknown) {
            captured.body = body;
            return this;
        },
    }) as unknown as Response;

const mockReq = () =>
    ({ path: "/api/test", method: "POST" }) as unknown as Request;

const handle = (err: unknown): Captured => {
    const captured: Captured = {};
    const next = vi.fn();
    errorHandler(err, mockReq(), mockRes(captured), next);
    return captured;
};

describe("errorHandler", () => {
    it("maps ZodError to 400 validation", () => {
        let thrown: unknown;
        try {
            OrganizationSchema.parse({});
        } catch (error) {
            thrown = error;
        }
        expect(thrown).toBeInstanceOf(ZodError);
        const captured = handle(thrown);
        expect(captured.statusCode).toBe(400);
        expect(captured.body).toMatchObject({ success: false, error: { type: "validation" } });
    });

    it("maps ValidationError to 400", () => {
        const captured = handle(new ValidationError("Bad input"));
        expect(captured.statusCode).toBe(400);
        expect(captured.body).toMatchObject({
            success: false,
            error: { type: "validation", message: "Bad input" },
        });
    });

    it("maps malformed JSON bodies to 400 instead of fatal 500", () => {
        const err = Object.assign(new SyntaxError("Unterminated string in JSON"), {
            status: 400,
            body: '{"name":"x',
        });
        const captured = handle(err);
        expect(captured.statusCode).toBe(400);
        expect(captured.body).toMatchObject({
            success: false,
            error: { type: "validation", message: "Invalid JSON body" },
        });
    });

    it("maps NotFoundError to 404", () => {
        const captured = handle(new NotFoundError("Project"));
        expect(captured.statusCode).toBe(404);
        expect(captured.body).toMatchObject({
            success: false,
            error: { type: "not_found" },
        });
    });

    it("maps UnauthorizedError to 401", () => {
        const captured = handle(new UnauthorizedError("Missing access token"));
        expect(captured.statusCode).toBe(401);
        expect(captured.body).toMatchObject({
            success: false,
            error: { type: "unauthorized", message: "Missing access token" },
        });
    });

    it("maps ForbiddenError to 403", () => {
        const captured = handle(new ForbiddenError());
        expect(captured.statusCode).toBe(403);
        expect(captured.body).toMatchObject({
            success: false,
            error: { type: "forbidden" },
        });
    });

    it("maps ConflictError to 409", () => {
        const captured = handle(new ConflictError("Already registered"));
        expect(captured.statusCode).toBe(409);
    });

    it("maps MongoDB duplicate-key errors to 409", () => {
        const err = Object.assign(new Error("E11000 duplicate key"), {
            name: "MongoServerError",
            code: 11000,
        });
        const captured = handle(err);
        expect(captured.statusCode).toBe(409);
        expect(captured.body).toMatchObject({ success: false });
    });

    it("maps unknown errors to generic 500 without leaking details", () => {
        const captured = handle(new Error("mongodb://secret-internal-host/db leaked?"));
        expect(captured.statusCode).toBe(500);
        expect(captured.body).toMatchObject({
            success: false,
            error: { type: "fatal", message: "An unexpected error occurred. Please try again later." },
        });
        expect(JSON.stringify(captured.body)).not.toContain("secret-internal-host");
    });
});
