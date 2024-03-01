// @unocss-include
import type { EngineSectionEntry } from '@factor/api'
import { vue } from '@factor/api'
import type { AdminEngineViewEntry } from '@factor/plugin-admin'
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
