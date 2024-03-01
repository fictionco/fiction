import type { AggregationResponse, EndpointResponse } from '@kaption/types'
import type { RequestFullAnalytics } from '../_widgets/types'

export interface SearchEndpoint {
  searchDimension: {
    request: RequestFullAnalytics
    response: EndpointResponse<AggregationResponse[]>
  }
}
