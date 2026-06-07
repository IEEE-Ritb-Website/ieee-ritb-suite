import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // In development, allow all origins by reflecting the requesting origin
    if (process.env.NODE_ENV !== "production") {
      callback(null, true);
      return;
    }

    // For non-browser / server requests without origin header, allow them
    if (!origin) {
      callback(null, true);
      return;
    }

    try {
      const parsed = new URL(origin);
      const hostname = parsed.hostname;
      // Allow ritb.in and subdomains, plus Netlify/Vercel preview hostnames
      if (
        hostname === "ritb.in" ||
        hostname.endsWith(".ritb.in") ||
        hostname.endsWith(".netlify.app") ||
        hostname.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    } catch {
      callback(null, false);
    }
  },
  credentials: true,
};
