import path from "path";
import fs from "fs";
export { isProduction } from "./index.js";

/**
 * Traverses directories upward from process.cwd() to locate the monorepo root.
 * This entrypoint imports fs and path and should only be used in Node.js environments.
 */
export function getMonorepoRoot(): string {
  let dir = process.cwd();
  while (dir !== path.parse(dir).root) {
    if (
      fs.existsSync(path.join(dir, "pnpm-workspace.yaml")) ||
      (fs.existsSync(path.join(dir, "package.json")) &&
        JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf-8")).workspaces)
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}
