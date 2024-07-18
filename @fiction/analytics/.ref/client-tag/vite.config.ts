import unocss from 'unocss/vite'
import {
  presetAttributify,
  presetMini,
  presetUno,
  presetWind,
  transformerCompileClass,
} from 'unocss'
import presetIcons from '@unocss/preset-icons'
import { safeDirname } from '@factor/api/utils'
import pluginVue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import type { InlineConfig } from 'vite'

const root = safeDirname(import.meta.url)

export default (_opts: { buildName: string }): InlineConfig => {
  return {
    root,
    configFile: false,
    mode: 'production',
    plugins: [
      cssInjectedByJsPlugin({ styleId: 'kaption-embed-style' }),
      pluginVue(),
      unocss({
        mode: 'vue-scoped',
        presets: [
          presetUno(),
          presetAttributify(),
          presetMini(),
          presetIcons(),
          presetWind(),
        ],
        transformers: [
          transformerCompileClass({
            classPrefix: 'ka-',
            trigger: 'isolate',
            keepUnknown: true,
          }),
        ],
      }),
    ],
  }
}
