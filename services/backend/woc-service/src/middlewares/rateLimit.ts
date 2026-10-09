import rateLimit from "express-rate-limit";

// Shared shape so clients get the standard envelope on 429s.
const limitMessage = {
    success: false,
    error: {
        type: "validation",
        message: "Too many requests, slow down and try again later.",
    },
} as const;

// Generous ceiling for public reads.
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: limitMessage,
});

// Tight ceiling for authenticated writes (register / create org / project).
export const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: limitMessage,
});
