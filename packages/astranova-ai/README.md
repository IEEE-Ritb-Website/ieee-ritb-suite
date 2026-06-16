# astranova-ai

A local CLI runner and wrapper around the OpenCode engine. It manages servers, Terminal UI (TUI) sessions, browser lifecycles, and direct terminal execution.

## Commands and Flag Combinations

All commands can be run using `pnpm ai` or `npx ai`.

### 1. Web UI Mode (Default)
Starts the local server (if down) and opens the Web UI in the default browser.

*   `pnpm ai` (or `pnpm ai --web`)
    Continues the most recent session for the current directory.
*   `pnpm ai --fresh`
    Creates a new session and opens the browser directly to that session's specific URL.
*   `pnpm ai "<message>"` (or `pnpm ai "<message>" --web`)
    Executes the prompt locally first, then starts the server and opens the browser to that session.
*   `pnpm ai "<message>" --fresh`
    Executes the prompt as a new session, then starts the server and opens the browser to that session.

### 2. Terminal UI Mode (--tui)
Launches the interactive OpenCode Terminal UI in the foreground.

*   `pnpm ai --tui`
    Launches the TUI continuing the last session.
*   `pnpm ai --tui --fresh`
    Launches the TUI starting a new session.
*   `pnpm ai --tui "<message>"`
    Launches the TUI and executes the prompt in the last session context.
*   `pnpm ai --tui "<message>" --fresh`
    Launches the TUI and executes the prompt in a new session context.

### 3. Native Terminal Mode (--native)
Executes a prompt directly in the active console headlessly and prints the output. Requires a message.

*   `pnpm ai --native "<message>"`
    Executes the prompt headlessly continuing the last session.
*   `pnpm ai --native "<message>" --fresh`
    Executes the prompt headlessly starting a new session.

## Lifecycle Details
*   If the runner starts a fresh server, the process remains active to print logs. Press `Ctrl+C` to terminate the server.
*   If the server is already active, the browser tab or TUI is launched, and the CLI process exits.
