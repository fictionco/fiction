/// <reference types="vitest" />
import { defineConfig } from "vite"
import { getViteConfig } from "@factor/render/vite.config"

export default defineConfig(async () => {
  const c = await getViteConfig()
  return { ...c, test: {} }
})
