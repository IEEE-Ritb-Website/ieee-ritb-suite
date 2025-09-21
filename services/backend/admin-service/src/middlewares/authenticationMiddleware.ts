import { auth } from "@/lib/auth";
import { ResponseCreator } from "@/utils/responseCreator";
import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    const responseCreator = new ResponseCreator("authenticationMiddleware");
    if (!session || !session.user) {
        {
            const { status, ...body } = responseCreator.unauthorized();
            return res.status(status).json({ ...body });
        }
    }
    next();
}
