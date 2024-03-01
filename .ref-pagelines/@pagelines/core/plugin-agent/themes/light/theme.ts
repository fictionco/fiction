// // @unocss-include
import type { ColorScheme, UserFont } from '@factor/api'
import { vue } from '@factor/api'
import type { GradientSetting, MediaDisplayObject } from '@factor/ui/utils'
import { AgentTheme } from '../../theme'
import type { ChatAgent } from '../../obj'
import ThemeIndex from './ThemeIndex.vue'

export interface EntryProps {
  actionColor?: string
  elementScheme?: ColorScheme
  bgColor: string
  bgImage?: MediaDisplayObject[]
  bgGradient?: GradientSetting
  themeFont?: UserFont
  bgMode?: 'color' | 'image' | 'gradient'
}

export const theme = new AgentTheme({
  themeId: 'light',

  el: (agent: ChatAgent) =>
    vue.computed(() => {
      return {
        component: ThemeIndex,
        props: { agent },
        options: [],
      }
    }),
})
