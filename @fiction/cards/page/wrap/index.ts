import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

export const templateId = 'cardPageWrapV1'

const UserConfigSchema = z.object({
  fixedHeader: z.boolean().optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const options = [
  new InputOption({ key: 'fixedHeader', label: 'Fixed Header', input: 'InputToggle' }),
] as InputOption[]

export const template = cardTemplate({
  templateId,
  el: vue.defineAsyncComponent(async () => import('./CardWrap.vue')),

  isPublic: false,
  isPageCard: true,
  title: 'Page Wrapper',
  description: 'A foundational layout component that provides consistent structure and behavior for your entire page.',
  subTitle: 'The foundational wrapper for site pages.',
  icon: 'i-tabler-layout-board-split',
  getBaseConfig: () => {
    return {
      standard: { spaceSize: 'none', showOnSingle: true },
    }
  },
  getConfig: async () => {
    return {
      schema: UserConfigSchema,
      options,
    }
  },
})
