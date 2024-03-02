// @unocss-include
import type { EngineSectionEntry } from '@fiction/core'
import { vue } from '@fiction/core'
import type { AdminEngineViewEntry } from '@fiction/plugin-admin'
import AuthLogo from './AuthLogo.vue'
import IconDashboard from './IconDashboard.vue'

interface Conf {
  views: AdminEngineViewEntry[]
  widgets: EngineSectionEntry[]
  ui: { AuthLogo?: vue.Component, IconDashboard?: vue.Component }
}

export const config: Conf = {
  views: [

    {
      viewId: 'plugins',
      icon: 'i-tabler-plug-connected',
      el: vue.defineAsyncComponent(() => import('./ViewPlugins.vue')),
      userConfig: { isNavItem: true },
    },
  ],
  widgets: [],
  ui: {
    AuthLogo,
    IconDashboard,
  },
}
