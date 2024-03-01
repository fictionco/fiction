import { updateUser } from '@factor/api'
import { requestSiteEndpoint } from '../tools/request'
import type { PrimaryEndpointMethod, PrimaryFetch } from '../serverTypes'

export const requestManageExperiment: PrimaryEndpointMethod<
  'manageExperiment'
> = async (args) => {
  const result = await requestSiteEndpoint<PrimaryFetch<'manageExperiment'>>(
    '/primary/manageExperiment',
    args,
  )

  await updateUser(() => result.user)

  return result
}

export const requestManageVariant: PrimaryEndpointMethod<
  'manageVariant'
> = async (args) => {
  const result = await requestSiteEndpoint<PrimaryFetch<'manageVariant'>>(
    '/primary/manageVariant',
    args,
  )

  await updateUser(() => result.user)

  return result
}
