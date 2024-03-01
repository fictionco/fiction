import type { Organization } from '@kaption/core'
import type { userProfessions } from './types'

export {}

// components.d.ts
// https://github.com/johnsoncodehk/volar/issues/482
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    component: (props: { is: Component }) => void
    transition: (props: { [key: string]: string }) => void
  }
}

declare module '@factor/api' {
  interface PublicUser {
    organizations: Organization[]
    profession?: (typeof userProfessions)[number]
  }
  interface PrivateUser {
    organizations: Organization[]
    profession?: (typeof userProfessions)[number]
  }
}
