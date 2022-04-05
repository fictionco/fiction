import path from "path"
import { createRequire } from "module"
import { defineConfig } from "vite"
import pluginVue from "@vitejs/plugin-vue"
const require = createRequire(import.meta.url)
const testPath = path.dirname(require.resolve("@factor/test"))
const entryDir = path.dirname(require.resolve("@factor/entry"))
const srcDir = path.dirname(require.resolve("@factor/site"))
const cwd = path.dirname(require.resolve("@factor/site"))
export default defineConfig({
  plugins: [pluginVue()],
  resolve: {
    alias: {
      "@src": srcDir,
      "@cwd": cwd,
      "@entry": entryDir,
      "@alias/app": entryDir,
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
