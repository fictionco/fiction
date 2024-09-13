import type { InputOption } from '@fiction/ui'
import { type EndpointMeta, type EndpointResponse, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { CardQuery, type CardQuerySettings } from '@fiction/site/cardQuery'
import { z } from 'zod'

const templateId = 'insta'

const schema = z.object({ })

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

class InstagramQuery extends CardQuery {
  async run(_params: { test: boolean }, _meta: EndpointMeta): Promise<EndpointResponse<{ test: boolean }>> {
    return { status: 'success', data: _params }
  }
}

function getQueries(args: CardQuerySettings) {
  return {
    instagram: new InstagramQuery(args),
  }
}

type ExtractCardRequests<T> = {
  [K in keyof T]: T[K] extends { run: (params: infer P, meta: any) => Promise<infer R> }
    ? { params: P, result: R }
    : never
}

export type CardRequests = ExtractCardRequests<Awaited<ReturnType<typeof getQueries>>>

export const templates = [
  cardTemplate({
    templateId,
    category: ['social'],
    description: 'Instagram galleries for your site',
    icon: 'i-tabler-image',
    colorTheme: 'rose',
    isPublic: false,
    schema,
    options,
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    getQueries,
  }),
] as const
