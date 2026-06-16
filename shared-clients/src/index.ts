import { isProduction } from "astranova-core";
import { createAdminServiceAPIClient } from "@astranova/admin-client";
import { createCommonAppServiceAPIClient } from "@astranova/common-app-client";
import { createRootServiceAPIClient } from "@astranova/root-client";

export const CLIENT_CONFIG: Record<
  string,
  { production: string; development: string }
> = {
  "admin-service": {
    production: "https://ieee-ritb-admin-service.onrender.com",
    development: "http://localhost:3000",
  },
  "common-app-service": {
    production: "https://apps-ritb.onrender.com",
    development: "http://localhost:3001",
  },
  "root-service": {
    production: "https://ieee-ritb-root-service.onrender.com",
    development: "http://localhost:3002",
  },
};

const isProd = isProduction();

/**
 * Optional terminal logger function injected by the consuming frontend.
 * When set, connection warnings are forwarded to the dev server terminal
 * in addition to the browser console. Call `registerTerminalLogger` to set this.
 */
let terminalLoggerFn: ((message: string) => void) | null = null;

/**
 * Register a function that forwards log messages to the dev server terminal.
 * Call this once at app startup (e.g. in main.tsx) before any API calls are made.
 *
 * @example
 * // In common-app-fe/src/main.tsx — forwards via Vite HMR WebSocket:
 * registerTerminalLogger((msg) => {
 *   if (import.meta.hot) import.meta.hot.send("astranova:terminal-log", { message: msg });
 * });
 */
export function registerTerminalLogger(fn: (message: string) => void) {
  terminalLoggerFn = fn;
}

function logConnectionWarning(serviceFolder: string, url: string) {
  if (isProd) return;

  const plainMessage =
    `[Astranova Client] Warning: Local server for "${serviceFolder}" is not running at ${url}.\n` +
    `Please start the backend service using:\n` +
    `  pnpm --filter ${serviceFolder} dev\n` +
    `or run the monorepo dev orchestrator.`;

  if (typeof window !== "undefined") {
    console.error(
      `%c${plainMessage}`,
      "color: #ff3333; font-weight: bold; font-size: 12px; padding: 4px; border: 1px solid #ff3333; border-radius: 4px;",
    );
    // Also forward to dev server terminal if a logger has been registered
    terminalLoggerFn?.(plainMessage);
  } else {
    console.warn(
      `\x1b[33m${plainMessage}\x1b[0m\n`,
    );
  }
}

function wrapClientWithConnectionCheck<T extends Record<string, any>>(
  client: T,
  serviceFolder: string,
  url: string,
): T {
  const wrapped: Record<string, any> = {};
  for (const [key, val] of Object.entries(client)) {
    if (typeof val === "function") {
      wrapped[key] = async (...args: any[]) => {
        try {
          return await val(...args);
        } catch (error: any) {
          if (
            error &&
            (error.code === "ERR_NETWORK" ||
              error.code === "ECONNREFUSED" ||
              error.message === "Network Error" ||
              !error.response)
          ) {
            logConnectionWarning(serviceFolder, url);
          }
          throw error;
        }
      };
    } else {
      wrapped[key] = val;
    }
  }
  return wrapped as T;
}

const adminUrl = isProd
  ? CLIENT_CONFIG["admin-service"].production
  : CLIENT_CONFIG["admin-service"].development;

export const AdminServiceAPIClient = wrapClientWithConnectionCheck(
  createAdminServiceAPIClient(adminUrl),
  "admin-service",
  adminUrl,
);
export const AdminServiceClient = AdminServiceAPIClient;

const commonAppUrl = isProd
  ? CLIENT_CONFIG["common-app-service"].production
  : CLIENT_CONFIG["common-app-service"].development;

export const CommonAppServiceAPIClient = wrapClientWithConnectionCheck(
  createCommonAppServiceAPIClient(commonAppUrl),
  "common-app-service",
  commonAppUrl,
);
export const CommonAppServiceClient = CommonAppServiceAPIClient;

const rootUrl = isProd
  ? CLIENT_CONFIG["root-service"].production
  : CLIENT_CONFIG["root-service"].development;

export const RootServiceAPIClient = wrapClientWithConnectionCheck(
  createRootServiceAPIClient(rootUrl),
  "root-service",
  rootUrl,
);
export const RootServiceClient = RootServiceAPIClient;
