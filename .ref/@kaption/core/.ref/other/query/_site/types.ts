import type { EndpointResponse, TrackingStatus } from '@kaption/types'
import type { Invalidation } from '@aws-sdk/client-cloudfront'

export interface SiteOperationsEndpoint {
  getTrackingStatus: {
    request: { projectId: string }
    response: EndpointResponse<TrackingStatus>
  }
  bustSiteScript: {
    request: { projectId: string }
    response: EndpointResponse<Invalidation>
  }
}
