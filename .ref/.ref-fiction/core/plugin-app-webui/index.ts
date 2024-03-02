// @unocss-include

import type { MenuItem } from '@factor/api'
import type { FictionAppSettings } from '../plugin-app-store/extend'
import { FictionApp } from '../plugin-app-store/extend'
import FigureVideo from '../ui/FigureVideo.vue'
import { getRoutes } from './routes'

export class AppWebUi extends FictionApp {
  appId = 'webui'
  icon = 'i-heroicons-light-bulb'
  appName = 'Automatic1111'
  tagline = 'AI Image Editing'
  version = '1.0'
  description
    = 'Run your own version of Automatic1111 SD webUI. Great for professional work.'

  tags = ['kit', 'inpainting', 'animation']
  figure = { component: FigureVideo, props: { orient: 'left' } }
  actions = (): MenuItem[] => {
    return [
      {
        name: 'Launch',
        link: this.factorRouter.link('webui'),
        btn: 'primary',
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
    super('AppWebUi', settings)

    this.factorRouter?.update(getRoutes())
  }
}
