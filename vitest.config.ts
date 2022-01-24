/// <reference types="vitest" />
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    exclude: [
      "node_modules",
      "**/node_modules",
      "dist",
      "cdk.out",
      ".git",
      ".cache",
    ],
    globalSetup: ["./@core/test/setupGlobal.ts"],
    setupFiles: ["./@core/test/setupTest.ts"],
  },
})
