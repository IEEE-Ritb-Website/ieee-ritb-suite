import { CorsOptions } from "cors";

import { isProduction } from "astranova-core/node";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // In development, allow all origins by reflecting the requesting origin
    if (!isProduction()) {
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
      // Allow ritb.in and any subdomain under ritb.in
      if (hostname === "ritb.in" || hostname.endsWith(".ritb.in")) {
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
