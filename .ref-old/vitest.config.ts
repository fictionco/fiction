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
      "@MAIN_FILE_ALIAS": `${process.cwd()}/@factor/www/src/index.ts`,
      "@MOUNT_FILE_ALIAS": `${process.cwd()}/@factor/plugin-app/mount.ts`,
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
    environmentOptions: {
      jsdom: {
        url: "https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
        referrer: "https://www.twitter.com",
        html: `<!DOCTYPE html><head><title>Test Title</title></head><body>Page Content <a href="#">link</a></body></html>`,
      },
    },
  },
})
