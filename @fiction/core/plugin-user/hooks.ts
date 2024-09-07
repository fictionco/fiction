import type { EndpointMeta } from '../utils/index.js'
import type { ManageUserParams } from './endpoint.js'
import type { ManageOrganizationParams } from './endpointOrg.js'
import type { Organization, User } from './index.js'
import '@fiction/core/plugin-env/hooks'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    processUser: { args: [User | undefined, { params: ManageUserParams, meta?: EndpointMeta }] }
    createUser: { args: [User, { params: ManageUserParams, meta?: EndpointMeta }] }
    updateOrganization: { args: [Organization, { params: ManageOrganizationParams, meta?: EndpointMeta }] }
  }
}
