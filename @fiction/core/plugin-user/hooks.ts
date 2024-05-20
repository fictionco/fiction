import '@fiction/core/plugin-env/hooks'
import type { EndpointMeta } from '../utils'
import type { ManageOrganizationParams, ManageUserParams, SetPasswordParams } from './endpoints'
import type { Organization, User } from '.'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    userOnVerified: { args: [User] }
    processUser: { args: [User | undefined, { params: ManageUserParams, meta?: EndpointMeta }] }
    createUser: { args: [User, { params: ManageUserParams, meta?: EndpointMeta }] }
    createPassword: { args: [User, { params: SetPasswordParams, meta?: EndpointMeta }] }
    updateOrganization: { args: [Organization, { params: ManageOrganizationParams, meta?: EndpointMeta }] }
  }
}
