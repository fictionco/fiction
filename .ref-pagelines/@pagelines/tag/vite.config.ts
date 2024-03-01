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
    define: {
      /**
       * this is required because vue includes process.env.NODE_ENV
       * not sure why this is included in a browser build
       */
      'process.env': 'Object',
    },
    plugins: [
      cssInjectedByJsPlugin({ styleId: 'pl-embed-style' }),
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
            classPrefix: 'pl-',
            trigger: 'isolate',
            keepUnknown: true,
          }),
        ],
      }),
    ],
  }
}
