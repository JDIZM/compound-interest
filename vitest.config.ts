/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul", // or 'v8'
      exclude: ["**/node_modules/**", "test*", "build.*", ".*.js", "types", "index.ts"]
    }
  }
});
