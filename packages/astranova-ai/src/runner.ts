import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

/**
 * Resolves the absolute path to the project-local opencode binary script.
 * This guarantees the tool runs using local workspace packages without global installations.
 */
export function getLocalOpencodePath(): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Check direct executable inside node_modules/opencode/bin/opencode.exe (available on all platforms)
    const localExePath = path.resolve(__dirname, "..", "node_modules", "opencode", "bin", "opencode.exe");
    if (fs.existsSync(localExePath)) {
        return localExePath;
    }
    
    const workspaceExePath = path.resolve(__dirname, "..", "..", "..", "node_modules", "opencode", "bin", "opencode.exe");
    if (fs.existsSync(workspaceExePath)) {
        return workspaceExePath;
    }

    const isWindows = process.platform === "win32";
    const binaryName = isWindows ? "opencode.cmd" : "opencode";
    
    // Check local package node_modules/.bin (dist/ is nested, so we go up one level)
    const localBinPath = path.resolve(__dirname, "..", "node_modules", ".bin");
    let targetPath = path.join(localBinPath, binaryName);
    if (fs.existsSync(targetPath)) {
        return targetPath;
    }
    
    // Fall back to workspace root node_modules/.bin
    const workspaceBinPath = path.resolve(__dirname, "..", "..", "..", "node_modules", ".bin");
    targetPath = path.join(workspaceBinPath, binaryName);
    if (fs.existsSync(targetPath)) {
        return targetPath;
    }
    
    // Fallback to system PATH resolution if all else fails
    return "opencode";
}

export interface RunAIOptions {
    /** Short label shown in the braille spinner while waiting, e.g. "Generating docs" */
    spinnerLabel?: string;
    /** Whether to show the stderr spinner (defaults to true) */
    showSpinner?: boolean;
    /** Working directory for the opencode process (defaults to process.cwd()) */
    cwd?: string;
    /** Optional file path to attach via opencode's -f flag (keeps the message arg short) */
    contextFilePath?: string;
    /** Timeout in milliseconds before the process is killed (default: 3 minutes) */
    timeoutMs?: number;
    /** Extra arguments to pass to the opencode run command */
    extraArgs?: string[];
    /** Callback called with stdout chunk data as it arrives */
    onStdout?: (data: string) => void;
    /** Callback called with stderr chunk data as it arrives */
    onStderr?: (data: string, firstDataReceived: boolean) => void;
}

/**
 * Runs `opencode run <message>` (optionally with a `-f <contextFile>` attachment)
 * and returns the full stdout as a string.
 *
 * Handles:
 *  - Braille spinner on stderr while waiting for the first byte of output
 *  - Windows .cmd binary resolution via cmd.exe (avoids shell: true / DEP0190)
 *  - Configurable timeout to prevent hanging indefinitely
 */
export function runAI(message: string, options: RunAIOptions = {}): Promise<string> {
    const {
        spinnerLabel = "Waiting for AI response",
        showSpinner = true,
        cwd = process.cwd(),
        contextFilePath,
        timeoutMs = 180000,
    } = options;

    return new Promise((resolve, reject) => {
        const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
        let frameIndex = 0;
        let firstData = false;

        let spinnerInterval: NodeJS.Timeout | null = null;
        if (showSpinner) {
            process.stderr.write(`⠋ ${spinnerLabel}...`);
            spinnerInterval = setInterval(() => {
                frameIndex = (frameIndex + 1) % spinnerFrames.length;
                if (!firstData) {
                    process.stderr.write(`\r${spinnerFrames[frameIndex]} ${spinnerLabel}...`);
                }
            }, 80);
        }

        const stopSpinner = () => {
            if (spinnerInterval) {
                clearInterval(spinnerInterval);
                process.stderr.write("\r\x1b[K");
            }
        };

        const isWindows = process.platform === "win32";
        const opencodePath = getLocalOpencodePath();
        
        // If it's a batch script (.cmd), we must wrap in cmd.exe.
        // If it's a direct executable (.exe), we can spawn it directly!
        const needsCmdWrap = isWindows && opencodePath.toLowerCase().endsWith(".cmd");
        const command = needsCmdWrap ? "cmd.exe" : opencodePath;
        const runArgs = [
            "run",
            message,
            ...(contextFilePath ? ["-f", contextFilePath] : []),
            ...(options.extraArgs || [])
        ];
        const spawnArgs = needsCmdWrap ? ["/c", opencodePath, ...runArgs] : runArgs;

        const child = spawn(command, spawnArgs, {
            cwd,
            stdio: ["ignore", "pipe", "pipe"],
            shell: false,
        });

        const timeout = setTimeout(() => {
            stopSpinner();
            child.kill();
            reject(new Error(`runAI timed out after ${timeoutMs / 1000}s waiting for a response.`));
        }, timeoutMs);

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data: Buffer) => {
            if (!firstData) {
                firstData = true;
                stopSpinner();
            }
            const str = data.toString();
            stdout += str;
            if (options.onStdout) {
                options.onStdout(str);
            }
        });

        child.stderr.on("data", (data: Buffer) => {
            const str = data.toString();
            stderr += str;
            if (options.onStderr) {
                options.onStderr(str, firstData);
            }
        });

        child.on("error", (err) => {
            stopSpinner();
            clearTimeout(timeout);
            reject(new Error(`Failed to spawn opencode: ${err.message}`));
        });

        child.on("exit", (code) => {
            stopSpinner();
            clearTimeout(timeout);
            if (code !== 0) {
                reject(new Error(`opencode exited with code ${code}:\n${stderr}`));
            } else {
                resolve(stdout);
            }
        });
    });
}
