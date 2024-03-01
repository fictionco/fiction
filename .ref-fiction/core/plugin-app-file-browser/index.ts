// @unocss-include

import type { MenuItem } from '@factor/api'
import type { FictionAppSettings } from '../plugin-app-store/extend'
import { FictionApp } from '../plugin-app-store/extend'
import thumb from './meta/thumb.svg'
import { getRoutes } from './routes'

export class AppFileBrowser extends FictionApp {
  appId = 'fileBrowser'
  icon = 'i-heroicons-light-bulb'
  appName = 'File Browser'
  tagline = 'Manage Server Files'
  version = '1.0'
  description
    = 'Install the file browser on your server to upload and download files. Great for managing your models and images.'

  tags = ['kit', 'files', 'server']
  thumb = thumb
  actions = (): MenuItem[] => {
    return [
      {
        name: 'Launch',
        link: this.factorRouter.link('fileBrowser'),
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
    super('AppFileBrowser', settings)

    this.factorRouter?.update(getRoutes())
  }
}
