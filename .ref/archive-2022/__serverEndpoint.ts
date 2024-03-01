import type express from 'express'
import { _stop } from '@factor/api'
import { nLog } from '@factor/server'
import type {
  EndpointResponse,
  ErrorConfig,
  PrivateUser,
} from '@factor/types'

import {
  createProject,
  generateApiSecret,
  getUserOrganizations,
  manageCustomDashboard,
  manageCustomEvent,
  manageMemberRelation,
  manageOrganization,
  manageProject,
  resendInvite,
  seekInviteFromUser,
  teamInvite,
} from '../@apps/app/src/admin/serverrc/admin/server'
import { manageUsage } from '../@apps/app/src/admin/billingUtilServerUsageUtilServerUsage'
import { refreshTrackingStatus } from '../@apps/app/src/admin/serverStatusin/serverStatus'
import type { PrimaryEndpoint, StructureMappedType } from './serverTypes'

// import {
//   getSessions,
//   saveSessions,
//   compileReplay,
//   getSingleSession,
// } from "./_replays/server"

export const EPMap: StructureMappedType = {
  generateApiSecret,
  refreshTrackingStatus,
  manageOrganization,
  manageProject,
  manageCustomEvent,
  manageCustomDashboard,
  getUserOrganizations,
  seekInviteFromUser,
  createProject,
  manageMemberRelation,
  teamInvite,
  resendInvite,
  // getSessions,
  // saveSessions,
  // compileReplay,
  // getSingleSession,
  manageUsage,
}

export const endpointPrimary = {
  name: 'primaryAppEndpoint',
  route: '/primary/:_method',
  handler: async <T extends keyof PrimaryEndpoint>(
    request: express.Request,
  ): Promise<EndpointResponse> => {
    const _method = request.params._method as T
    const args = request.body as PrimaryEndpoint[T] & {
      bearer?: PrivateUser
      projectId?: string
      organizationId?: string
    }

    const { userId } = request.bearer ?? {}

    let r: EndpointResponse = {
      status: 'error',
      message: `method missing in endpoint map: /primary/${_method}`,
    }

    try {
      if (!userId) {
        throw _stop({
          message: 'you must be logged in',
          data: {
            _method,
            args,
            bearer: request.bearer,
            headers: request.headers,
          },
        })
      }

      args.bearer = request.bearer
      if (EPMap[_method]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        r = await EPMap[_method](args as any)
      }
    }
    catch (error: unknown) {
      const e = error as ErrorConfig
      const { query, params, bearer } = request
      nLog('error', `(primary app) endpoint error: ${_method}`, e)
      nLog('error', `(primary app) endpoint params: ${_method}`, {
        query,
        params,
        bearer,
      })

      r = {
        status: 'error',
        message: e.expose ? e.message : 'server error logged',
        code: e.code,
        expose: e.expose,
      }
    }

    return r
  },
}
