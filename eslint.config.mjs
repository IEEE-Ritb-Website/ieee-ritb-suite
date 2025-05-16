import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["packages/**/*.{js,mjs,cjs,ts}", "services/**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    ...tseslint.configs.recommended,
    rules: {
      "prefer-const": "off",
    },
    languageOptions: {
      parserOptions: {
        project: ["./services/*/tsconfig.json"],
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    }
  },
]);
