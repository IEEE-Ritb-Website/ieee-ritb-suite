/**
 * instrumentation-client.ts — Next.js client-side instrumentation entry point.
 *
 * This file runs once in the browser before React hydration, making it the
 * Next.js equivalent of Vite's main.tsx for one-time client setup.
 *
 * Here we register the shared-clients terminal logger so that any connection
 * warnings (e.g. a backend service not running locally) are forwarded to the
 * Next.js dev server terminal via a Server Action, in addition to appearing
 * in the browser console.
 */
import { registerTerminalLogger } from "shared-clients";
import { logToTerminal } from "@/actions/log-terminal";

registerTerminalLogger((message) => {
  // logToTerminal is a Server Action — its output appears in the `next dev` terminal.
  // The catch silently swallows failures (e.g. during static export).
  logToTerminal(message).catch(() => {});
});
