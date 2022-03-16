import path from "path"
import { createRequire } from "module"
import { defineConfig } from "vite"
import pluginVue from "@vitejs/plugin-vue"
const require = createRequire(import.meta.url)
const testPath = path.dirname(require.resolve("@factor/test"))
export default defineConfig({
  plugins: [pluginVue()],
  test: {
    exclude: [
      "node_modules",
      "**/node_modules",
      "dist",
      "cdk.out",
      ".git",
      ".cache",
    ],

    setupFiles: [`${testPath}/setupTest.ts`],
  },
})
