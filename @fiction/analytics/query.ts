import type { EndpointMeta, EndpointResponse, FictionDb } from '@fiction/core'
import { Query, vue } from '@fiction/core'
import type { DataCompared, QueryParams } from './types'

export type AnalyticsQuerySettings<U extends object = object> = {
  fictionDb: FictionDb
  key: string
} & U

export abstract class AnalyticsQuery<
T extends DataCompared = DataCompared,
U extends object = object,
> extends Query<AnalyticsQuerySettings<U>> {
  db = () => this.settings.fictionDb.client()
  data = vue.ref<T>()
  queryParams = vue.ref<QueryParams>({})
  abstract dataKeys: readonly string[]
  constructor(settings: AnalyticsQuerySettings<U>) {
    super(settings)
  }

  abstract override run(params: QueryParams, meta?: EndpointMeta): Promise<EndpointResponse<T>>
}
