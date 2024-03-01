import type { EndpointResponse } from '@kaption/types'
import type { ComparedDataItem, QueryMapItem, RequestFullAnalytics } from './types'
import type * as replay from './replay/map'

export type EndpointMap = {
  widgets: {
    request: RequestFullAnalytics & {
      cb?: (
        response: EndpointResponse<QueryMapItem<ComparedDataItem | unknown>[]>,
      ) => void
    }
    response: EndpointResponse<QueryMapItem<ComparedDataItem>[]>
  }
} & replay.EndpointMap
