import { defineConfig } from "vite"
import { getViteConfig } from "../render/vite.config"

const dir = new URL(".", import.meta.url).pathname

const viteConfig = getViteConfig({ mode: "development" })
export const vitestConfig = defineConfig({
  ...viteConfig,
  test: {
    exclude: [
      "node_modules",
      "**/node_modules",
      "dist",
      "cdk.out",
      ".git",
      ".cache",
    ],
    globalSetup: [`${dir}/setupGlobal.ts`],
    setupFiles: [`${dir}/setupTest.ts`],
  },
})
