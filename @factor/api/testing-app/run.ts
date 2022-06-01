import { createServer } from "vite"
import vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"
import presetIcons from "@unocss/preset-icons"
import { presetAttributify, presetUno, presetWind } from "unocss"
import { safeDirname } from "@factor/api"

export const createTestApp = async (options: {
  port?: number
  head?: string
}) => {
  const { port = 1000, head = "" } = options
  const server = await createServer({
    configFile: false,
    root: safeDirname(import.meta.url),
    server: {
      port,
    },
    plugins: [
      {
        name: "html-transform",
        transformIndexHtml(html: string) {
          return html.replace(/<\/head>/i, `${head}</head>`)
        },
      },
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
  })
  await server.listen()

  server.printUrls()

  return server
}
