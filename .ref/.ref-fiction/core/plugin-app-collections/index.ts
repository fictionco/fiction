// @unocss-include

import type { MenuItem } from '@factor/api'
import type { FictionAppSettings } from '../plugin-app-store/extend'
import { FictionApp } from '../plugin-app-store/extend'
import thumb from './meta/thumb.svg'
import { getRoutes } from './routes'

export class AppCollections extends FictionApp {
  appId = 'collections'
  icon = 'i-heroicons-light-bulb'
  appName = 'Collections'
  tagline = 'Show Off Your Work'
  version = '1.0'
  description
    = 'Create collections of images and media to share with others. Creates a shareable web interface for your images.'

  tags = ['social', 'sharing']
  thumb = thumb
  actions = (): MenuItem[] => {
    return [
      {
        name: 'View Your Collections',
        link: this.factorRouter.link('collectionIndex'),
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
    super('AppCollections', settings)
    this.factorRouter?.update(getRoutes())
  }
}
