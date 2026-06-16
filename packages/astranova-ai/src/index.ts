#!/usr/bin/env node
/**
 * Astranova AI CLI Runner
 * 
 * A clean, self-documenting wrapper around the local opencode-ai binary.
 * Supports running commands:
 *  - inside the Web UI (--web, default)
 *  - in the Terminal UI (--tui)
 *  - directly in the terminal (--native)
 *  - in a new session (--fresh) or continuing the last session (default).
 * 
 * If no command message is provided, it starts the local server and opens the browser.
 */

import { spawn, exec } from "child_process";
import fs from "fs";
import path from "path";
import { runAI, getLocalOpencodePath } from "./runner.js";

const SERVER_PORT = 4096;
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`;

let serverChildProcess: any = null;
let runnerChildProcess: any = null;

function cleanupServer() {
    if (runnerChildProcess) {
        try {
            runnerChildProcess.kill("SIGTERM");
        } catch {
            // ignore
        }
        runnerChildProcess = null;
    }
    if (serverChildProcess) {
        console.log("\nStopping OpenCode server...");
        try {
            serverChildProcess.kill("SIGTERM");
        } catch {
            // ignore
        }
        serverChildProcess = null;
    }
}

function setupCleanupHandlers() {
    process.on("exit", cleanupServer);
    process.on("SIGINT", () => {
        cleanupServer();
        process.exit(0);
    });
    process.on("SIGTERM", () => {
        cleanupServer();
        process.exit(0);
    });
}

// Helper: Pause execution for a given duration in milliseconds
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Searches upward from the current directory to find the monorepo root.
 */
export function getMonorepoRoot(): string {
    let dir = process.cwd();
    while (dir !== path.parse(dir).root) {
        if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml')) ||
            (fs.existsSync(path.join(dir, 'package.json')) &&
                JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8')).workspaces)) {
            return dir;
        }
        dir = path.dirname(dir);
    }
    return process.cwd();
}

function getOpencodeExecutablePath(): string {
    return getLocalOpencodePath();
}

/**
 * Opens a URL in the user's default web browser in a cross-platform manner.
 */
function openBrowser(url: string, callback?: () => void) {
    if (process.platform === "win32") {
        const child = spawn("explorer.exe", [url], { detached: true, stdio: "ignore" });
        child.unref();
        if (callback) {
            let called = false;
            const done = () => {
                if (called) return;
                called = true;
                callback();
            };
            child.on("exit", done);
            child.on("error", done);
        }
    } else {
        const startCommand = process.platform === "darwin" ? "open" : "xdg-open";
        exec(`${startCommand} ${url}`, (err) => {
            if (err) {
                console.error(`Failed to open browser: ${err.message}`);
            }
            if (callback) callback();
        });
    }
}

/**
 * Spawns a background process completely hidden from the user (no console window pop-ups on Windows).
 */
function spawnHiddenProcess(command: string, args: string[], cwd: string, pipeOutput = false) {
    const isWindows = process.platform === "win32";
    const needsCmdWrap = isWindows && (command.toLowerCase().endsWith(".cmd") || command === "opencode");
    const finalCommand = needsCmdWrap ? "cmd.exe" : command;
    const finalArgs = needsCmdWrap ? ["/c", command, ...args] : args;

    if (isWindows) {
        return spawn(finalCommand, finalArgs, {
            cwd,
            detached: !pipeOutput,
            stdio: pipeOutput ? ["ignore", "pipe", "pipe"] : ["ignore", "ignore", "ignore"],
            windowsHide: true
        });
    } else {
        return spawn(command, args, {
            cwd,
            detached: !pipeOutput,
            stdio: pipeOutput ? ["ignore", "pipe", "pipe"] : ["ignore", "ignore", "ignore"],
            shell: true
        });
    }
}

/**
 * Checks if the local OpenCode server is active and listening on port 4096.
 */
async function isServerRunning(): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        const res = await fetch(SERVER_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        // Any response status (including 404/401) indicates the server port is active
        return res.ok || res.status === 404 || res.status === 401;
    } catch {
        return false;
    }
}

/**
 * Ensures the OpenCode server is running. Starts it in the background if it is currently down.
 * Returns true if started fresh, false if it was already running.
 */
async function ensureServerRunning(unref = true): Promise<boolean> {
    const isAlreadyRunning = await isServerRunning();
    if (isAlreadyRunning) {
        return false;
    }

    const workspaceRoot = getMonorepoRoot();
    const opencodePath = getOpencodeExecutablePath();
    console.log(`Starting OpenCode server at root: ${workspaceRoot}`);
    
    const serverProcess = spawnHiddenProcess(
        opencodePath,
        ["serve", "--port", String(SERVER_PORT), "--print-logs", "--log-level", "DEBUG"],
        workspaceRoot,
        !unref
    );
    
    if (unref) {
        serverProcess.unref();
    } else {
        serverChildProcess = serverProcess;
        serverProcess.stdout?.on("data", (data) => process.stdout.write(data));
        serverProcess.stderr?.on("data", (data) => process.stderr.write(data));
    }

    console.log("Waiting for OpenCode server to start...");
    let ready = false;
    for (let attempt = 0; attempt < 30; attempt++) {
        await delay(500);
        if (await isServerRunning()) {
            ready = true;
            break;
        }
    }

    if (!ready) {
        throw new Error("Timeout: OpenCode server failed to start within 15 seconds.");
    }

    // Give the server a moment to stabilize internal bindings
    await delay(1000);
    return true;
}

/**
 * Finds the most recent session for the current directory, or null if none exists.
 */
async function findExistingSession(): Promise<string | null> {
    const currentDir = process.cwd();
    try {
        const response = await fetch(`${SERVER_URL}/session`);
        if (response.ok) {
            const sessions = await response.json() as Array<{ id: string; directory?: string; dir?: string; time: { updated: number } }>;
            const matchingSessions = sessions.filter((s) => {
                const dir = s.directory || s.dir;
                return dir && path.resolve(dir).toLowerCase() === path.resolve(currentDir).toLowerCase();
            });
            if (matchingSessions.length > 0) {
                matchingSessions.sort((a, b) => b.time.updated - a.time.updated);
                return matchingSessions[0].id;
            }
        }
    } catch {
        // server may not be ready
    }
    return null;
}

/**
 * Creates a fresh session for the current directory on the OpenCode server.
 */
async function createFreshSession(): Promise<string> {
    const currentDir = process.cwd();
    const postData = JSON.stringify({
        title: `Fresh Session - ${path.basename(currentDir)}`,
        dir: currentDir,
        directory: currentDir
    });
    const response = await fetch(`${SERVER_URL}/session`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: postData
    });
    if (!response.ok) {
        throw new Error(`Failed to create fresh session: ${response.statusText}`);
    }
    const session = await response.json() as { id: string };
    return session.id;
}

/**
 * Starts the server (if down) and opens the Web UI in the browser.
 */
async function startWebUIOnly(fresh: boolean) {
    try {
        const startedFresh = await ensureServerRunning(false);
        const currentDir = process.cwd();

        let sessionUrl = SERVER_URL;
        let sessionId: string | null = null;

        if (!fresh) {
            sessionId = await findExistingSession();
            if (sessionId) {
                console.log(`Continuing existing session: ${sessionId}`);
            }
        }

        if (!sessionId) {
            console.log(fresh ? "Creating a fresh session..." : "No existing session found. Creating a fresh session...");
            try {
                sessionId = await createFreshSession();
                console.log(`Fresh session created with ID: ${sessionId}`);
            } catch (err: any) {
                console.warn(`Could not create fresh session via API: ${err.message}. Falling back to root URL.`);
            }
        }

        if (sessionId) {
            const base64ProjectPath = Buffer.from(currentDir).toString("base64")
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_");
            sessionUrl = `${SERVER_URL}/${base64ProjectPath}/session/${sessionId}`;
        }

        console.log(`OpenCode server is running at ${SERVER_URL}`);
        console.log(`Session URL: ${sessionUrl}`);
        console.log("Opening OpenCode Web UI in browser...");
        openBrowser(sessionUrl);

        if (startedFresh) {
            console.log("\nPress Ctrl+C to stop the server and exit.");
            setupCleanupHandlers();
        } else {
            setTimeout(() => process.exit(0), 1000);
        }
    } catch (err: any) {
        console.error(`Failed to launch Web UI: ${err.message}`);
        process.exit(1);
    }
}

/**
 * Runs a command locally then opens the Web UI in the browser.
 * Runs locally (not through the server HTTP API) to avoid a server-side
 * bug where session_message.seq is not initialized on HTTP prompts.
 */
async function executeOnWebUI(message: string, fresh: boolean) {
    try {
        // Kill any lingering server on 4096 to prevent opencode run
        // from auto-attaching to it, which would hit the server-side seq bug.
        cleanupServer();

        // Run the command locally first (avoids server-side seq bug)
        const continueFlag = !fresh;
        await runAI(message, {
            spinnerLabel: "Waiting for AI response",
            timeoutMs: 120000,
            extraArgs: continueFlag ? ["--continue"] : [],
            onStdout: (data) => {
                process.stdout.write(data);
            },
            onStderr: (data, firstDataReceived) => {
                if (firstDataReceived) {
                    process.stderr.write(data);
                }
            }
        });

        // Then start the server and open the web UI for continuation
        const startedFresh = await ensureServerRunning(false);
        const currentDir = process.cwd();

        let sessionUrl = SERVER_URL;
        const sessionId = await findExistingSession();
        if (sessionId) {
            const base64ProjectPath = Buffer.from(currentDir).toString("base64")
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_");
            sessionUrl = `${SERVER_URL}/${base64ProjectPath}/session/${sessionId}`;
        }

        console.log(`OpenCode server is running at ${SERVER_URL}`);
        console.log(`Session URL: ${sessionUrl}`);
        console.log("Opening OpenCode Web UI in browser...");
        openBrowser(sessionUrl);

        if (startedFresh) {
            console.log("\nPress Ctrl+C to stop the server and exit.");
            setupCleanupHandlers();
        } else {
            setTimeout(() => process.exit(0), 1000);
        }
    } catch (err: any) {
        console.error(`\n${err.message}`);
        process.exit(1);
    }
}

/**
 * Opens the OpenCode TUI (Terminal UI) directly.
 */
async function startTUIOnly(fresh: boolean) {
    try {
        const currentDir = process.cwd();
        const opencodePath = getOpencodeExecutablePath();

        const args: string[] = [];
        if (!fresh) {
            args.push("--continue");
        }

        console.log("Opening OpenCode TUI...");

        const tuiProcess = spawn(opencodePath, args, {
            cwd: currentDir,
            stdio: "inherit",
            shell: true,
            windowsHide: false,
        });

        tuiProcess.on("exit", (code) => {
            process.exit(code ?? 0);
        });
    } catch (err: any) {
        console.error(`Failed to launch TUI: ${err.message}`);
        process.exit(1);
    }
}

/**
 * Runs a command on the TUI (Terminal UI) in the foreground.
 */
async function executeOnTUI(message: string, fresh: boolean) {
    try {
        const currentDir = process.cwd();
        const opencodePath = getOpencodeExecutablePath();

        const args: string[] = ["--prompt", message];
        if (!fresh) {
            args.push("--continue");
        }

        console.log("Launching command on the TUI...");

        const tuiProcess = spawn(opencodePath, args, {
            cwd: currentDir,
            stdio: "inherit",
            shell: true,
            windowsHide: false,
        });

        tuiProcess.on("exit", (code) => {
            process.exit(code ?? 0);
        });
    } catch (err: any) {
        console.error(`TUI execution failed: ${err.message}`);
        process.exit(1);
    }
}

/**
 * Executes a command headlessly directly in the current terminal session.
 */
async function executeInTerminal(message: string, fresh: boolean) {
    const continueFlag = !fresh;

    try {
        await runAI(message, {
            spinnerLabel: "Waiting for AI response",
            timeoutMs: 120000,
            extraArgs: continueFlag ? ["--continue"] : [],
            onStdout: (data) => {
                process.stdout.write(data);
            },
            onStderr: (data, firstDataReceived) => {
                if (firstDataReceived) {
                    process.stderr.write(data);
                }
            }
        });
        process.exit(0);
    } catch (err: any) {
        console.error(`\n❌ ${err.message}`);
        process.exit(1);
    }
}

/**
 * Deletes sessions with no messages (created by old POST /session calls).
 * These empty sessions cause NOT NULL constraint failed on session_message.seq
 * when opencode tries to continue them.
 */
async function cleanupEmptySessions() {
    try {
        const opencodePath = getOpencodeExecutablePath();
        await new Promise<void>((resolve) => {
            const child = spawn(
                opencodePath,
                ["db", "DELETE FROM session WHERE id IN (SELECT s.id FROM session s LEFT JOIN session_message sm ON s.id = sm.session_id WHERE sm.id IS NULL)"],
                { stdio: "ignore", shell: true, windowsHide: true }
            );
            child.on("exit", () => resolve());
            child.on("error", () => resolve());
        });
    } catch {
        // skip
    }
}

/**
 * Main application CLI logic parsing flags and executing actions.
 */
const HELP_TEXT = `
Usage: pnpm ai [flags] [message]

Flags:
  --web        Open or run commands in the Web UI (default when no flag is specified)
  --tui        Open or run commands in the Terminal UI
  --native     Run headlessly in the terminal (requires a message)
  --fresh      Start a new session instead of continuing the last one
  --help       Show this help message

Message prefixes:
  @file:<path>   Read the prompt from a file

Modes (mutually exclusive):

  Launch modes — opens the respective interface:
    pnpm ai                          Open Web UI (continues last session)
    pnpm ai --fresh                  Open Web UI (fresh session)
    pnpm ai --tui                    Open TUI (continues last session)
    pnpm ai --tui --fresh            Open TUI (fresh session)

  Execution modes — runs a prompt and then opens the Web UI:
    pnpm ai "message"                Run on Web UI (continues last session)
    pnpm ai --fresh "message"        Run on Web UI (fresh session)
    pnpm ai --tui "message"          Run on TUI (continues last session)
    pnpm ai --tui --fresh "message"  Run on TUI (fresh session)

  Headless mode — runs directly in the terminal without opening any UI:
    pnpm ai --native "message"               Run headless (continues last session)
    pnpm ai --native --fresh "message"       Run headless (fresh session)

  The "run" prefix is automatically stripped:
    pnpm ai run "message"                    Same as pnpm ai "message"
`;

async function main() {
    const args = process.argv.slice(2);

    if (args.includes("--help") || args.includes("-h")) {
        console.log(HELP_TEXT);
        process.exit(0);
    }

    // Clean up empty/dangling sessions left by old POST /session API
    await cleanupEmptySessions();

    const hasWebFlag = args.includes("--web");
    const hasTuiFlag = args.includes("--tui");
    const hasNativeFlag = args.includes("--native");
    const hasFreshFlag = args.includes("--fresh");

    // Filter out known flags to get the positional arguments
    const positionalArgs = args.filter(
        (arg) => arg !== "--web" && arg !== "--tui" && arg !== "--native" && arg !== "--fresh"
    );

    // Strip optional "run" prefix if provided (e.g. 'pnpm ai run "message"')
    if (positionalArgs[0] === "run") {
        positionalArgs.shift();
    }

    let message = positionalArgs.join(" ").trim();
    if (message.startsWith("@file:")) {
        const filePath = message.slice(6).trim();
        try {
            message = fs.readFileSync(filePath, "utf-8");
        } catch (e: any) {
            console.error(`Error: Failed to read file ${filePath}: ${e.message}`);
            process.exit(1);
        }
    }

    // Validation: flag --native requires a message payload
    if (hasNativeFlag && !message) {
        console.error("Error: Flag --native requires a message/command to be passed.");
        console.log("Example: pnpm ai --native \"explain this project\"");
        process.exit(1);
    }

    // Validation: cannot specify mutually exclusive mode flags
    const modeFlags = [hasWebFlag, hasTuiFlag, hasNativeFlag].filter(Boolean).length;
    if (modeFlags > 1) {
        console.error("Error: Cannot specify multiple mode flags (--web, --tui, --native) together.");
        process.exit(1);
    }

    // Select behavior based on arguments
    if (!message && !hasWebFlag && !hasTuiFlag && !hasNativeFlag) {
        // No flags and no message: launch Web UI (with or without starting a fresh session)
        await startWebUIOnly(hasFreshFlag);
    } else if (hasTuiFlag && !message) {
        // --tui without message: open TUI (with or without starting a fresh session)
        await startTUIOnly(hasFreshFlag);
    } else if (hasTuiFlag) {
        // --tui with message: run command on TUI
        await executeOnTUI(message, hasFreshFlag);
    } else if (hasNativeFlag) {
        // Explicit terminal mode
        await executeInTerminal(message, hasFreshFlag);
    } else {
        // Default message execution (or explicit --web): run on Web UI
        await executeOnWebUI(message, hasFreshFlag);
    }
}

main();
