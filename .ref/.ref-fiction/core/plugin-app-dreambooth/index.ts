// @unocss-include

import type { MenuItem } from '@factor/api'
import type { FictionAppSettings } from '../plugin-app-store/extend'
import { FictionApp } from '../plugin-app-store/extend'
import dreamboothSvg from './meta/fig.svg'

export class AppDreambooth extends FictionApp {
  appId = 'dreambooth'
  icon = 'i-heroicons-light-bulb'
  appName = 'Dreambooth'
  tagline = 'Generate AI Avatars'
  version = '1.0'
  description
    = 'Multi-concept Dreambooth. A new way to train a model with multiple styles, people, animals, or objects.'

  tags = ['dreambooth', 'images', 'avatars']
  thumb = dreamboothSvg
  actions = (): MenuItem[] => {
    return [
      {
        name: 'Train Avatar Model',
        link: this.factorRouter.link('modelIndex', {}, { create: 1 }),
        btn: 'primary',
      },
      {
        name: 'Generate Avatars',
        link: this.factorRouter.link(
          'renderCreate',
          { modelId: '' },
          { create: 1 },
        ),
        btn: 'default',
      },
    ]
  }

  loading = this.utils.vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  isLive = this.factorEnv.isProd
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  constructor(settings: FictionAppSettings) {
    super('AppDreambooth', settings)
  }

  protected createQueries() {
    return {} as const
  }
}
