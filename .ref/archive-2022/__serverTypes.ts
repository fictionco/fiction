import type { PrivateUser } from '@factor/types'
import type { EPManage } from '@kaption/app/src/admin/serverTypes'
import type { EPReplays } from './_replays/serverTypes'

export type PrimaryEndpoint = EPManage & EPReplays

export interface PrimaryFetch<U extends keyof PrimaryEndpoint> {
  request: PrimaryEndpoint[U]['request']
  response: PrimaryEndpoint[U]['response']
  endpoint: `/primary/${U}`
  method: U
}

export type PrimaryEndpointMethod<U extends keyof PrimaryEndpoint> = (
  args: PrimaryEndpoint[U]['request'] & { projectId?: string },
) => Promise<PrimaryEndpoint[U]['response']>

export type PrimaryEndpointMethodWithBearer<U extends keyof PrimaryEndpoint> = (
  args: PrimaryEndpoint[U]['request'] & {
    bearer: PrivateUser
    projectId?: string
    organizationId?: string
  },
) => Promise<PrimaryEndpoint[U]['response']>

export type StructureMappedType = {
  [K in keyof PrimaryEndpoint]:
    | PrimaryEndpointMethod<K>
    | PrimaryEndpointMethodWithBearer<K>
}
