import { createServer } from 'vite'
import type { FactorEnv } from '@factor/api'
import { FactorBuild, safeDirname } from '@factor/api'
import vuePlugin from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import {
  presetMini,
  presetUno,
  presetWind,
  transformerCompileClass,
} from 'unocss'
import presetIcons from '@unocss/preset-icons'

export async function getServer(args: {
  port: number
  head?: string
  body?: string
  factorEnv: FactorEnv
}) {
  const { port, head = '', body = '', factorEnv } = args
  const factorBuild = new FactorBuild({ factorEnv })

  const config = await factorBuild.getFactorViteConfig({
    config: {
      root: safeDirname(import.meta.url),
      mode: 'development',
      server: { port },
      configFile: false,
      plugins: [
        vuePlugin(),
        unocss({
          mode: 'vue-scoped',
          presets: [presetUno(), presetMini(), presetIcons(), presetWind()],
          transformers: [
            transformerCompileClass({
              classPrefix: 'ka-',
              trigger: ':isolate:',
              keepUnknown: true,
            }),
          ],
          theme: {
            colors: {
              theme: {
                DEFAULT: 'var(--theme-0, #FFFFFF)',
                0: 'var(--theme-0, #FFFFFF)',
                50: 'var(--theme-50, #f8fafc)',
                100: 'var(--theme-100, #f1f5f9)',
                200: 'var(--theme-200, #e2e8f0)',
                300: 'var(--theme-300, #cbd5e1)',
                400: 'var(--theme-400, #94a3b8)',
                500: 'var(--theme-500, #64748b)',
                600: 'var(--theme-600, #475569)',
                700: 'var(--theme-700, #334155)',
                800: 'var(--theme-800, #1e293b)',
                900: 'var(--theme-900, #0f172a)',
                1000: 'var(--theme-1000, #000000)',
              },
            },
          },
        }),
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
