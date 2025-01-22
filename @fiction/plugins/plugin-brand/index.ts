import type { FictionAdmin } from '@fiction/admin'
import type { template as dashTemplate, panelTemplate } from '@fiction/admin/dashboard/cardDash'

import type { FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { ManageBrandGuideQuery } from './endpoint'
import { brandTable } from './schema'

export type FictionBrandSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionAdmin: FictionAdmin
  fictionRouter: FictionRouter
  fictionMedia: FictionMedia
} & FictionPluginSettings

export class FictionBrand extends FictionPlugin<FictionBrandSettings> {
  queries = {
    ManageBrandGuide: new ManageBrandGuideQuery({ fictionBrand: this, ...this.settings }),
  }

  requests = this.createRequests({ queries: this.queries, fictionServer: this.settings.fictionServer, fictionUser: this.settings.fictionUser, basePath: '/send' })

  constructor(settings: FictionBrandSettings) {
    super('FictionBrand', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionDb.addTables([brandTable])

    this.admin()
  }

  admin() {
    const { fictionAdmin } = this.settings

    fictionAdmin.addAdminPages({ key: 'send', loader: async ({ factory }) => [

      await factory.fromTemplate<typeof dashTemplate>({
        templateId: 'dash',
        slug: 'brand',
        title: 'Brand',
        cards: [
          await factory.fromTemplate<typeof panelTemplate>({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManageBrand.vue')),
            cards: [
              await factory.fromTemplate<typeof panelTemplate>({
                slug: '_home',
                title: 'Brand Guide', // More specific than just 'Guide'
                description: 'Define your brand identity and style guidelines',
                el: vue.defineAsyncComponent(async () => import('./admin/BrandGuide.vue')),
                userConfig: {
                  isNavItem: true,
                  navIcon: 'i-tabler-map',
                },
              }),
              // await factory.fromTemplate<typeof panelTemplate>({
              //   slug: 'model',
              //   title: 'AI Knowledge Base', // More intuitive than 'Content Model'
              //   description: 'Train AI with your brand voice and content guidelines',
              //   el: vue.defineAsyncComponent(async () => import('./admin/ManageModel.vue')),
              //   userConfig: {
              //     isNavItem: true,
              //     navIcon: 'i-tabler-search',
              //   },
              // }),
              await factory.fromTemplate<typeof panelTemplate>({
                slug: 'change-brand',
                title: 'Create/Change Brand',
                description: 'Change the primary brand model',
                el: vue.defineAsyncComponent(async () => import('./admin/IndexList.vue')),
                userConfig: {
                  isNavItem: true,
                  navIcon: 'i-tabler-map-share',
                  navIconAlt: 'i-tabler-map-plus',
                },
              }),
            ],
          }),
        ],
        userConfig: {
          isNavItem: false,
          navIcon: 'i-tabler-map',
          navIconAlt: 'i-tabler-map-check',
          priority: 200,
        },
      }),

    ] })
  }
}
