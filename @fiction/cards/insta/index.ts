import { type EndpointMeta, type EndpointResponse, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { CardQuery } from '@fiction/site/cardQuery'
import type { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'insta'

const schema = z.object({ })

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

class InstagramQuery extends CardQuery {
  async run(_params: { test: boolean }, _meta: EndpointMeta): Promise<EndpointResponse> {
    return { status: 'success', data: _params }
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
    getQueries: args => ({
      instagram: new InstagramQuery(args),
    }),
  }),
] as const
