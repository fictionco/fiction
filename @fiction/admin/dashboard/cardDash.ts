import { MediaBasicSchema } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import FictionLogo from '@fiction/ui/brand/FictionLogo.vue'
import { z } from 'zod'
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
  logo: MediaBasicSchema.optional(),
  homeUrl: z.string().optional(),
})

export type AuthPageUserConfig = z.infer<typeof AuthPageSchema>

export const authTemplate = cardTemplate({
  templateId: 'auth',
  el: DashWrap,
  getConfig: async () => ({ schema: AuthPageSchema }),
})

export const template = cardTemplate({
  templateId: 'dash',
  el: DashWrap,
  isPageCard: true,
  getBaseConfig: () => ({
    homeIcon: { format: 'component' as const, el: FictionLogo },
    authRedirect: '/auth',
    standard: { spaceSize: 'none' },
  }),
  getConfig: async () => ({ schema }),
})
