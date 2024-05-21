import '@fiction/core/plugin-env/hooks'
import type { EndpointMeta } from '../utils'
import type { ManageUserParams } from './endpoint'
import type { ManageOrganizationParams } from './endpointOrg'
import type { Organization, User } from '.'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    processUser: { args: [User | undefined, { params: ManageUserParams, meta?: EndpointMeta }] }
    createUser: { args: [User, { params: ManageUserParams, meta?: EndpointMeta }] }
    updateOrganization: { args: [Organization, { params: ManageOrganizationParams, meta?: EndpointMeta }] }
  }
}
