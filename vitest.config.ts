import path from "path"
import { createRequire } from "module"
import { defineConfig } from "vite"
import pluginVue from "@vitejs/plugin-vue"
const require = createRequire(import.meta.url)
const factorDir = path.dirname(require.resolve("@factor/api"))
const testPath = path.join(factorDir, "./test-utils")
const entryDir = path.join(factorDir, "./entry")
const srcDir = path.dirname(require.resolve("@factor/site"))
const cwd = path.dirname(require.resolve("@factor/site/package.json"))
export default defineConfig({
  plugins: [pluginVue()],
  resolve: {
    alias: {
      "@src": srcDir,
      "@cwd": cwd,
      "@entry": entryDir,
    },
  },

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
    watchIgnore: [/\/node_modules\//, /\/dist\//, /\/.factor\//],
  },
})
