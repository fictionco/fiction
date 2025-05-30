import type { StandardUserConfig } from '@fiction/site/schema'
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'
import { InputOption } from '@fiction/ui'
import { z } from 'zod/v4'

export const templateId = 'cardPageWrapV1'

const UserConfigSchema = z.object({
  fixedHeader: z.boolean().optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema> & StandardUserConfig

const options = [
  new InputOption({ key: 'fixedHeader', label: 'Fixed Header', input: 'InputToggle' }),
] as InputOption[]

export const template = cardTemplate({
  templateId,
  el: vue.defineAsyncComponent(async () => import('./ElWrap.vue')),

  isPublic: false,
  isPageCard: true,
  title: 'Page Wrapper',
  description: 'A foundational layout component that provides consistent structure and behavior for your entire page.',
  subTitle: 'The foundational wrapper for site pages.',
  icon: 'i-tabler-layout-board-split',
  getBaseConfig: () => {
    return {
      standard: { spaceSize: 'none' as const, showOnSingle: true },
    }
  },
  getConfig: async () => {
    return {
      schema: UserConfigSchema,
      options,
    }
  },
})
