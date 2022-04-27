/**
 * NOT IN WORKSPACE CONTEXT
 */
import path from "path"
import { createRequire } from "module"
import { defineConfig } from "vite"
import pluginVue from "@vitejs/plugin-vue"
const require = createRequire(import.meta.url)
const cwd = path.dirname(require.resolve("@factor/site/package.json"))
const apiDir = require.resolve("@factor/api")
export default defineConfig({
  plugins: [pluginVue()],
  resolve: {
    alias: {
      "@MAIN_FILE_ALIAS": `${cwd}/src/index.ts`,
      "@MOUNT_FILE_ALIAS": `${apiDir}/plugin-app/mount.ts`,
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

    setupFiles: [require.resolve(`./scripts/setupTest.ts`)],
    watchIgnore: [/\/node_modules\//, /\/dist\//, /\/.factor\//],
  },
})
