import type { StandardUserConfig } from '@fiction/site/schema'
import { ActionAreaSchema, SuperTitleSchema, vue } from '@fiction/core/index.js'
import { cardTemplate } from '@fiction/site/card.js'
import { createOption } from '@fiction/ui/index.js'
import { z } from 'zod/v4'

export const schema = z.object({
  superTitle: SuperTitleSchema.optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  action: ActionAreaSchema.optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

async function getConfig() {
  const options = [
    createOption({ key: 'superTitle', label: 'Super Title', input: 'InputSuperTitle' }),
    createOption({ key: 'title', label: 'Title', input: 'InputTextarea' }),
    createOption({ key: 'subTitle', label: 'Sub Title', input: 'InputTextarea' }),
    createOption({ key: 'action.buttons', label: 'Actions', input: 'InputActions' }),
  ]

  return { schema, options, userConfig: {} }
}

export const template = cardTemplate({
  templateId: 'card404ErrorV1',
  title: '404 Error',
  subTitle: 'A simple yet effective not-found page.',
  icon: 'i-tabler-error-404',
  colorTheme: 'red',
  el: vue.defineAsyncComponent(async () => import('./El404.vue')),
  isPublic: false,
  getConfig,
})
