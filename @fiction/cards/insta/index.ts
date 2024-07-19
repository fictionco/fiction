import { type EndpointMeta, type EndpointResponse, Query, vue } from '@fiction/core'
import type { SendEndpointSettings } from '@fiction/plugins/plugin-send/endpoint'
import { CardTemplate } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'insta'

const schema = z.object({ })

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

class InstagramQuery extends Query {
  constructor(settings: SendEndpointSettings) {
    super(settings)
  }

  async run(_params: any, _meta: EndpointMeta): Promise<EndpointResponse> {
    return { status: 'success', data: [] }
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['social'],
    description: 'Instagram galleries for your site',
    icon: 'i-tabler-image',
    colorTheme: 'rose',
    isPublic: false,
    schema,
    options,
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  }),
] as const
