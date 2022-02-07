import { defineConfig } from "vite"
import path from "path"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const testPath = path.dirname(require.resolve("@factor/test"))
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
    globalSetup: [`${testPath}/setupGlobal.ts`],
    setupFiles: [`${testPath}/setupTest.ts`],
  },
})
