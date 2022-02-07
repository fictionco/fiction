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
    include: ["**/*.test.ts"],
    globalSetup: ["./@core/test/setupGlobal.ts"],
    setupFiles: ["./@core/test/setupTest.ts"],
  },
})
