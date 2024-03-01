/** server-only-file */
import { setupPostgresDb } from '@kaption/service/dbPostgres'
import type { DataProcessor, FullUser, ServiceConfigServer } from '@factor/types'
import type { EndpointMeta } from '@factor/engine'
import type { ManageUserParams } from '@factor/engine/userAuth'
import stripeServerPlugin from '@factor/plugin-stripe/server'
import { plugins } from '@kaption/engine/plugins'
import { enrichUser } from '@kaption/app/src/serverEnrichUsererverEnrichUser'
import { stripeServerConfig } from '@kaption/app/src/billingUtilServerllingUtilServer'
import {
  Queries,
  endpointsMap,
} from '@kaption/app/src/serverAdminsrc/serverAdmin'

export const processorAddUserOrganizations: DataProcessor<
  FullUser,
  { params?: ManageUserParams, meta?: EndpointMeta }
> = {
  name: 'addUserOrganizations',
  handler: async (user: FullUser, config): Promise<FullUser> => {
    const { params, meta } = config ?? {}

    if (params?._action === 'getPublic' || !meta)
      return user

    const r = await Queries.ProcessUser.serve(user, meta)

    return r.data || user
  },
}

export function setup(): ServiceConfigServer {
  return {
    endpoints: [...Object.values(endpointsMap)],
    plugins: [stripeServerPlugin(stripeServerConfig()), ...plugins],
    hooks: [
      {
        hook: 'afterServerSetup',
        callback: async (): Promise<void> => {
          await setupPostgresDb()
        },
      },
      {
        hook: 'onUserVerified',
        callback: async (user: FullUser): Promise<void> => {
          await enrichUser(user)
        },
      },
    ],
    userProcessors: [processorAddUserOrganizations],
  }
}
