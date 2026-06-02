import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

const blockSignUp = (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname.includes("sign-up")) {
        return new Response("Sign up is disabled", { status: 403 });
    }
    return null;
};

export const GET = async (req: Request) => {
    const blocked = blockSignUp(req);
    if (blocked) return blocked;
    return handler.GET(req);
};

export const POST = async (req: Request) => {
    const blocked = blockSignUp(req);
    if (blocked) return blocked;
    return handler.POST(req);
};
