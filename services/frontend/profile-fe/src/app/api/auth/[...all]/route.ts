import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import clientPromise, { getDbName } from "@/lib/db";

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

    if (req.url.includes("sign-in/email")) {
        try {
            // Clone the request to parse the JSON body safely without consuming the original body stream
            const body = await req.clone().json();
            const identifier = body.email; // This contains the user input from the email / membership id field

            if (identifier) {
                const client = await clientPromise;
                const db = client.db(getDbName());

                // Find user by either email or membershipId in the MongoDB database
                const user = await db.collection("user").findOne({
                    $or: [
                        { email: identifier },
                        { membershipId: identifier }
                    ]
                });

                if (user && user.email) {
                    // Update request body with the actual email address
                    body.email = user.email;

                    // Reconstruct the request with the updated body content
                    const newReq = new Request(req.url, {
                        method: req.method,
                        headers: req.headers,
                        body: JSON.stringify(body),
                    });

                    return handler.POST(newReq);
                }
            }
        } catch (e) {
            console.error("Error in sign-in interceptor:", e);
        }
    }

    return handler.POST(req);
};

