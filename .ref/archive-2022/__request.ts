import {
  activeOrganization,
  setCurrentProjectId,
  syncProjectId,
} from '@kaption/engine/activeProject'

import { endpointFetch, userInitialized } from '@factor/api'
import type { PrimaryEndpoint, PrimaryFetch } from '../serverTypes'

type EndpointProp<
  T extends keyof PrimaryEndpoint,
  U extends 'endpoint' | 'request' | 'response' | 'method',
> = PrimaryFetch<T>[U]

export async function requestManageEndpoint<T extends keyof PrimaryEndpoint>(method: EndpointProp<T, 'method'>, data: EndpointProp<T, 'request'>): Promise<EndpointProp<T, 'response'>> {
  await userInitialized()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const endpoint = `/primary/${method}` as `/primary/${T}`
  const r = await endpointFetch<PrimaryFetch<T>>(endpoint, data)

  if (r.projectId)
    setCurrentProjectId(r.projectId as string)

  return r
}

export async function requestSiteEndpoint<T extends keyof PrimaryEndpoint>(method: EndpointProp<T, 'method'>, data: EndpointProp<T, 'request'>): Promise<EndpointProp<T, 'response'>> {
  const projectId = await syncProjectId()
  const org = activeOrganization.value

  if (!projectId)
    throw new Error(`projectId needed / ${method}`)
  if (!org?.organizationId)
    throw new Error(`organizationId needed / ${method}`)

  const organizationId = org.organizationId

  return requestManageEndpoint(method, { projectId, organizationId, ...data })
}

export async function requestResendInvite(organizationId: string, emails: string[]): Promise<boolean> {
  const r = await requestManageEndpoint<'resendInvite'>('resendInvite', {
    organizationId,
    invites: emails.map((email) => {
      return { email }
    }),
  })

  return r.status === 'success'
}
