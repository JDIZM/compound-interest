import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Migrated from the old .eslintignore (flat config has no .eslintignore support).
  { ignores: ["dist/**", "coverage/**", "test-package/**", "env.d.ts"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  // Disable formatting rules that Prettier owns — keep this last so it wins.
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    // Tests/mocks don't need the same strictness.
    files: ["**/__mocks__/*", "**/*.{test,tests}.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
);
