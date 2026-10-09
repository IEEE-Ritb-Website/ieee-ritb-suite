/**
 * instrumentation-client.ts — Next.js client-side instrumentation entry point.
 *
 * Next.js runs this file once in the browser before React hydration, making it
 * the equivalent of Vite's main.tsx for one-time client setup.
 *
 * Registers the shared-clients terminal logger so that backend connection
 * warnings are forwarded to the Next.js dev server terminal via a Server Action,
 * in addition to appearing in the browser console.
 */
import { registerTerminalLogger } from "shared-clients";
import { logToTerminal } from "@/actions/log-terminal";

registerTerminalLogger((message) => {
  logToTerminal(message).catch(() => {});
});
