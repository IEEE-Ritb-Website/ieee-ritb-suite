import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = handler.GET;
export const POST = async (req: Request) => {
    if (req.url.includes("sign-up")) {
        return new Response("Sign up is disabled", { status: 403 });
    }
    return handler.POST(req);
};

