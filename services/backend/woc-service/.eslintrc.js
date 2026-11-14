module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended", "plugin:@typescript-eslint/recommended"
  ],
  ignorePatterns: ["dist", "node_modules", "scripts"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
};