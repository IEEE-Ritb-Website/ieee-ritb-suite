import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["packages/**/*.{js,mjs,cjs,ts}", "services/**/*.{js,mjs,cjs,ts}"],
    rules: {
      "prefer-const": "off",
    },
    languageOptions: {
      parserOptions: {
        project: ["./services/*/tsconfig.json", "./packages/*/tsconfig.json"],
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]);
