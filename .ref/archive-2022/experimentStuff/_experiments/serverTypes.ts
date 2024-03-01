import type {
  ChangeRecord,
  Experiment,
  ItemStatus,
  TargetingFilter,
  Variant,
} from '@kaption/types'
import type {
  EndpointManageAction,
  EndpointResponse,
  PrivateUser,
} from '@factor/types'

export * from '@kaption/types'

export interface EPExperiments {
  manageExperiment: {
    request: {
      experimentName?: string
      experimentId?: string
      experimentDescription?: string
      experimentStatus?: ItemStatus
      rules?: TargetingFilter[]
      goals?: string[]
      variantWeights?: Record<string, number>
      _action: EndpointManageAction
    }
    response: EndpointResponse<Partial<Experiment>> & { user?: PrivateUser }
  }
  manageVariant: {
    request: {
      variantName?: string
      variantId?: string
      variantDescription?: string
      changes?: ChangeRecord
      weight?: number
      experimentId: string
      _action: EndpointManageAction
    }
    response: EndpointResponse<Variant> & { user?: PrivateUser }
  }
}
