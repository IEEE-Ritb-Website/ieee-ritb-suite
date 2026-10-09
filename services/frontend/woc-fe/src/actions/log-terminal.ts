"use server";

import { isProduction } from "astranova-core";

/**
 * Server Action: logToTerminal
 *
 * Called by client components (via registerTerminalLogger in shared-clients)
 * to forward connection warnings from the browser to the Next.js dev server
 * terminal. Server actions run on the Node.js process, so console output
 * appears directly in the terminal window running `next dev`.
 *
 * This is a no-op in production — the registerTerminalLogger is only
 * registered in development.
 */
export async function logToTerminal(message: string): Promise<void> {
  if (isProduction()) return;
  process.stdout.write(`\n\x1b[33m${message}\x1b[0m\n\n`);
}
