import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul", // or 'v8'
      exclude: [
        "**/node_modules/**",
        "**/test*",
        "**/build.*",
        "**/.eslintrc.*",
        "**/*.config.*",
        "types/**",
        "**/index.ts"
      ]
    }
  }
});
