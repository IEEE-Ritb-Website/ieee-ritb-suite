#!/usr/bin/env node
/**
 * Astranova AI CLI Runner
 * 
 * A clean, self-documenting wrapper around the local opencode-ai binary.
 * Supports running commands:
 *  - inside the Web UI (--ui, default)
 *  - directly in the terminal (--native)
 *  - in a new session (--fresh) or continuing the last session (default).
 * 
 * If no command message is provided, it starts the local server and opens the browser.
 */

import { spawn, exec } from "child_process";
import fs from "fs";
import path from "path";

const SERVER_PORT = 4096;
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`;

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

/**
 * Resolves the path to the project-local opencode binary script.
 * This guarantees the tool runs using local workspace packages without global installations.
 */
function getOpencodeExecutablePath(): string {
    const workspaceRoot = getMonorepoRoot();
    const isWindows = process.platform === "win32";
    const executableName = isWindows ? "opencode.CMD" : "opencode";

    // 1. Check workspace root node_modules/.bin
    const workspaceBinPath = path.join(workspaceRoot, "node_modules", ".bin", executableName);
    if (fs.existsSync(workspaceBinPath)) {
        return workspaceBinPath;
    }

    // 2. Check packages/astranova-ai/node_modules/.bin
    const packageBinPath = path.join(__dirname, "..", "node_modules", ".bin", executableName);
    if (fs.existsSync(packageBinPath)) {
        return packageBinPath;
    }

    // 3. Fallback to global command in PATH
    return "opencode";
}

/**
 * Opens a URL in the user's default web browser in a cross-platform manner.
 */
function openBrowser(url: string) {
    const startCommand = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
    exec(`${startCommand} ${url}`, (err) => {
        if (err) {
            console.error(`Failed to open browser: ${err.message}`);
        }
    });
}

/**
 * Spawns a background process completely hidden from the user (no console window pop-ups on Windows).
 */
function spawnHiddenProcess(command: string, args: string[], cwd: string) {
    if (process.platform === "win32") {
        // Wrap command in a hidden PowerShell execution to prevent terminal window pop-ups
        const commandLine = `${command} ${args.map(a => `"${a.replace(/"/g, '\\"')}"`).join(" ")}`;
        return spawn("powershell", ["-WindowStyle", "Hidden", "-Command", commandLine], {
            cwd,
            detached: true,
            stdio: "ignore"
        });
    } else {
        return spawn(command, args, {
            cwd,
            detached: true,
            stdio: "ignore",
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
async function ensureServerRunning(): Promise<boolean> {
    const isAlreadyRunning = await isServerRunning();
    if (isAlreadyRunning) {
        return false;
    }

    const workspaceRoot = getMonorepoRoot();
    const opencodePath = getOpencodeExecutablePath();
    console.log(`Starting OpenCode server in background at root: ${workspaceRoot}`);
    
    const serverProcess = spawnHiddenProcess(opencodePath, ["web", "--port", String(SERVER_PORT)], workspaceRoot);
    serverProcess.unref();

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
 * Resolves the session ID to use for running commands or opening the browser.
 * If fresh is false, it searches for the most recently updated session matching the current directory.
 * If fresh is true, or no session is found, it requests a new session.
 */
async function resolveSession(fresh: boolean, messageSnippet?: string): Promise<string> {
    const currentDir = process.cwd();

    if (!fresh) {
        try {
            const response = await fetch(`${SERVER_URL}/session`);
            if (response.ok) {
                const sessions = await response.json() as Array<{ id: string; directory: string; time: { updated: number } }>;
                const matchingSessions = sessions.filter(
                    (s) => s.directory && path.resolve(s.directory).toLowerCase() === path.resolve(currentDir).toLowerCase()
                );
                if (matchingSessions.length > 0) {
                    // Sort by updated time in descending order to get the latest session
                    matchingSessions.sort((a, b) => b.time.updated - a.time.updated);
                    const latestSessionId = matchingSessions[0].id;
                    console.log(`Continuing existing session: ${latestSessionId}`);
                    return latestSessionId;
                }
            }
        } catch (err: any) {
            console.warn(`Could not query existing sessions: ${err.message}. Creating a new one...`);
        }
    }

    // Create a new session
    console.log("Creating a fresh session on the OpenCode server...");
    const sessionTitle = messageSnippet 
        ? `Astranova Run: ${messageSnippet}` 
        : `Astranova Session - ${new Date().toLocaleString()}`;

    const createResponse = await fetch(`${SERVER_URL}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            title: sessionTitle,
            dir: currentDir,
            directory: currentDir
        })
    });

    if (!createResponse.ok) {
        throw new Error(`Failed to create session: ${createResponse.statusText}`);
    }

    const sessionData = await createResponse.json() as { id: string };
    console.log(`Fresh session created with ID: ${sessionData.id}`);
    return sessionData.id;
}

/**
 * Starts the server (if down), resolves the session, and opens the Web UI in the browser.
 */
async function startWebUIOnly(fresh: boolean) {
    try {
        const startedFresh = await ensureServerRunning();
        await resolveSession(fresh);

        // If the server started fresh, it opens the default homepage automatically.
        // If it was already running or we requested a fresh session, we open the browser to the home URL.
        if (!startedFresh || fresh) {
            console.log("Opening OpenCode Web UI in browser...");
            openBrowser(SERVER_URL);
        } else {
            console.log("OpenCode Web UI opened in browser.");
        }
    } catch (err: any) {
        console.error(`Failed to launch Web UI: ${err.message}`);
        process.exit(1);
    }
}

/**
 * Runs a command on the Web UI (browser) in the background.
 */
async function executeOnWebUI(message: string, fresh: boolean) {
    try {
        const startedFresh = await ensureServerRunning();
        const sessionId = await resolveSession(fresh, message.slice(0, 30));
        const currentDir = process.cwd();
        const opencodePath = getOpencodeExecutablePath();

        // Open the browser to the chat session if the server was already running
        if (!startedFresh) {
            console.log("Opening OpenCode Web UI in browser...");
            openBrowser(SERVER_URL);
        }

        // Wait to allow browser tab to load and connect to the event stream
        console.log("Allowing Web UI browser tab to initialize...");
        await delay(3000);

        console.log("Launching command on the Web UI...");
        const runnerProcess = spawnHiddenProcess(
            opencodePath,
            ["run", message, "--attach", SERVER_URL, "--session", sessionId],
            currentDir
        );
        runnerProcess.unref();

        console.log("Command successfully sent to OpenCode Web UI. You can monitor the progress in your browser.");
    } catch (err: any) {
        console.error(`Web execution failed: ${err.message}`);
        console.log("Falling back to local terminal execution...");
        await executeInTerminal(message, fresh);
    }
}

/**
 * Executes a command headlessly directly in the current terminal session.
 */
async function executeInTerminal(message: string, fresh: boolean) {
    console.log(`Running command headlessly in terminal: "${message}"...`);
    const opencodePath = getOpencodeExecutablePath();
    const args = ["run", message];

    // If not a fresh session, we pass the continue flag to inherit the last session context
    if (!fresh) {
        args.push("--continue");
    }

    const child = spawn(opencodePath, args, {
        stdio: "inherit",
        shell: true
    });

    child.on("error", (err) => {
        console.error("Failed to start opencode-ai command:", err);
        process.exit(1);
    });

    child.on("exit", (code) => {
        process.exit(code ?? 0);
    });
}

/**
 * Main application CLI logic parsing flags and executing actions.
 */
async function main() {
    const args = process.argv.slice(2);

    const hasUiFlag = args.includes("--ui");
    const hasNativeFlag = args.includes("--native");
    const hasFreshFlag = args.includes("--fresh");

    // Filter out known flags to get the positional arguments
    const positionalArgs = args.filter(
        (arg) => arg !== "--ui" && arg !== "--native" && arg !== "--fresh"
    );

    // Strip optional "run" prefix if provided (e.g. 'pnpm ai run "message"')
    if (positionalArgs[0] === "run") {
        positionalArgs.shift();
    }

    const message = positionalArgs.join(" ").trim();

    // Validation: flag --ui or --native requires a message payload
    if ((hasUiFlag || hasNativeFlag) && !message) {
        console.error("Error: Flag --ui or --native requires a message/command to be passed.");
        console.log("Example: pnpm ai --ui \"explain this project\"");
        process.exit(1);
    }

    // Validation: cannot specify both --ui and --native
    if (hasUiFlag && hasNativeFlag) {
        console.error("Error: Cannot specify both --ui and --native flags.");
        process.exit(1);
    }

    // Select behavior based on arguments
    if (!message && !hasUiFlag && !hasNativeFlag) {
        // Just launch the Web UI (with or without starting a fresh session)
        await startWebUIOnly(hasFreshFlag);
    } else if (hasNativeFlag) {
        // Explicit terminal mode
        await executeInTerminal(message, hasFreshFlag);
    } else {
        // Default message execution (or explicit --ui): run on Web UI
        await executeOnWebUI(message, hasFreshFlag);
    }
}

main();
