/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["**/node_modules/**", "test*", "build.*", ".*.js", "types", "index.ts"]
    }
  }
});
