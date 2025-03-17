import { ActionAreaSchema, SuperTitleSchema, vue } from '@fiction/core/index.js'
import { cardTemplate } from '@fiction/site/index.js'
import { createOption } from '@fiction/ui/index.js'
import { z } from 'zod'

export const schema = z.object({
  superTitle: SuperTitleSchema.optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  action: ActionAreaSchema.optional(),
})

export type UserConfig = z.infer<typeof schema>

async function getConfig() {
  const options = [
    createOption({ key: 'superTitle', label: 'Super Title', input: 'InputSuperTitle' }),
    createOption({ key: 'title', label: 'Title', input: 'InputTextarea' }),
    createOption({ key: 'subTitle', label: 'Sub Title', input: 'InputTextarea' }),
    createOption({ key: 'action', label: 'Actions', input: 'InputActionArea' }),
  ]

  return {
    schema,
    options,
    userConfig: {},
  }
}

export const template = cardTemplate({
  templateId: 'card404ErrorV1',
  subTitle: 'A simple yet effective not-found page.',
  category: ['special'],
  icon: 'i-tabler-error-404',
  colorTheme: 'red',
  el: vue.defineAsyncComponent(async () => import('./El404.vue')),
  isPublic: false,
  getConfig,
})
