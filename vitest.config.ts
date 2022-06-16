/**
 * NOT IN WORKSPACE CONTEXT
 */
import { createRequire } from "module"
import { defineConfig } from "vite"
import pluginVue from "@vitejs/plugin-vue"
const require = createRequire(import.meta.url)
export default defineConfig({
  plugins: [pluginVue()],
  resolve: {
    alias: {
      "@MAIN_FILE_ALIAS": `${process.cwd()}/@factor/site/src/index.ts`,
      "@MOUNT_FILE_ALIAS": `${process.cwd()}/@factor/plugin-env/mount.ts`,
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
    watchExclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.factor/**",
      "**/.ref/**",
      "**/__*",
    ],
  },
})
