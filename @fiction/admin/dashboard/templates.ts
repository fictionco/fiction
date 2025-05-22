import { MediaSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'
import { z } from 'zod/v4'
import DashWrap from './DashWrap.vue'

export const schema = z.object({
  isNavItem: z.boolean().optional(),
  navIcon: z.string().optional(),
  navIconAlt: z.string().optional(),
  parentItemId: z.string().optional(),
  priority: z.number().optional(),
  layoutFormat: z.union([z.literal('container'), z.literal('full')]).optional(),
  navTitle: z.string().optional(),
  authRedirect: z.string().optional(),
  parentNavItemSlug: z.string().optional(),
})

export type UserConfig = z.infer<typeof schema>

export const panelTemplate = cardTemplate({
  templateId: 'panel',
  el: DashWrap,
  getConfig: async () => ({ schema }),
})

export const AuthPageSchema = z.object({
  logo: MediaSchema.optional(),
  homeUrl: z.string().optional(),
})

export type AuthPageUserConfig = z.infer<typeof AuthPageSchema>

export const authTemplate = cardTemplate({
  templateId: 'authPage',
  el: vue.defineAsyncComponent(() => import('../dashboard/AuthView.vue')),
  getConfig: async () => ({ schema: AuthPageSchema }),
})

export const settingsTemplate = cardTemplate({
  templateId: 'settingsPage',
  el: vue.defineAsyncComponent(() => import('../settings/SettingsMain.vue')),
  getConfig: async () => ({ schema: AuthPageSchema }),
})

export const dashTemplate = cardTemplate({
  templateId: 'dash',
  el: DashWrap,
  isPageCard: true,
  getBaseConfig: () => ({
    authRedirect: '/auth',
    standard: { spaceSize: 'none' as const },
  }),
  getConfig: async () => ({ schema }),
})
