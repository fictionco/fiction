import path from "node:path"
import vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"
import { presetAttributify, presetUno, presetWind } from "unocss"
import presetIcons from "@unocss/preset-icons"
import { InlineConfig } from "vite"
import { safeDirname } from "../utils"
const vars = {
  NODE_ENV: process.env.NODE_ENV,
}

const root = safeDirname(import.meta.url)

const processDefines = Object.fromEntries(
  Object.entries(vars).map(([k, v]) => {
    return [`process.env.${k}`, JSON.stringify(v)]
  }),
)

export default (_opts: { buildName: string }): InlineConfig => {
  const { buildName } = _opts

  let ssr
  let ssrManifest
  let outDir
  if (buildName === "server") {
    ssr = "src/server-entry.ts"
    outDir = path.join(root, "dist", "server")
  } else if (buildName == "client") {
    ssrManifest = true
    outDir = path.join(root, "dist", "client")
  }

  return {
    define: processDefines,
    configFile: false,
    root,
    build: { outDir, ssr, ssrManifest },
    plugins: [
      vue(),
      unocss({
        presets: [
          presetIcons(),
          presetUno(),
          presetWind(),
          presetAttributify(),
        ],
      }),
    ],
  }
}
