import { createServer } from 'vite'
import type { FictionEnv } from '@fiction/core'
import { FictionBuild, safeDirname } from '@fiction/core'
import vuePlugin from '@vitejs/plugin-vue'

export async function getServer(args: {
  port: number
  head?: string
  body?: string
  fictionEnv: FictionEnv
}) {
  const { port, head = '', body = '', fictionEnv } = args
  const factorBuild = new FictionBuild({ fictionEnv })

  const config = await factorBuild.getFictionViteConfig({
    mode: 'test',
    config: {
      root: safeDirname(import.meta.url),
      mode: 'development',
      server: { port },
      configFile: false,
      plugins: [
        vuePlugin(),
        {
          name: 'htmlTransform',
          transformIndexHtml(html) {
            const out = html
              .replace(/<\/head>/i, `${head}\n</head>`)
              .replace(/<\/body>/i, `${body}\n</body>`)

            return out
          },
        },
      ],
    },
  })

  const server = await createServer(config)

  return server
}
