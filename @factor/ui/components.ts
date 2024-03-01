import { vue } from '@factor/api'

const def = vue.defineAsyncComponent

export const El404 = def(() => import('./El404.vue'))

export type UserConfig = InstanceType<typeof El404>['$props']
