import type { FictionApp } from './plugin-app/index.js'
import type { FictionDb } from './plugin-db/index.js'
import type { FictionEnv, ServiceList } from './plugin-env/index.js'
import type { FictionMedia } from './plugin-media/index.js'
import type { FictionRouter } from './plugin-router/index.js'
import type { FictionServer } from './plugin-server/index.js'
import type { FictionUser } from './plugin-user/index.js'
import { vue } from './utils/index.js'

export type RunVars = {
  RUN_MODE: 'prod' | 'dev' | 'test'
  RUN_ENV: 'node' | 'browser' | 'ssr'
  APP_INSTANCE: string
  MOUNT_CONTEXT: Record<string, string>
  FICTION_ORG_ID: string // integrate db org with static
  FICTION_SITE_ID: string // integrate db site with static
  APP_PORT: string
  COMMAND: string
  COMMAND_OPTS: string
  GOOGLE_CLIENT_ID: string
  HOST: string
  HOSTNAME: string
  IP_ADDRESS: string
  IS_APP_SSR: string
  IS_APP_CLIENT: string
  NODE_ENV: string
  PATHNAME: string
  PROTOCOL: string
  SERVER_PORT: string
  SUBDOMAIN: string
  ORIGINAL_HOST: string
  USER_AGENT: string
  ORIGIN: string
  URL: string
  ALL_HEADERS: string
  IS_TEST: string
  VITEST: string
  CI: string
  DEBUG: string
  IS_RESTART: string
  RUNTIME_VERSION: string
  RUNTIME_COMMIT: string
}

export type StandardServices = {
  fictionRouter: FictionRouter
  fictionUser: FictionUser
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionMedia: FictionMedia
  fictionDb: FictionDb
  fictionServer: FictionServer
  runVars?: RunVars
} & ServiceList

export function useService<T extends ServiceList>(): T & StandardServices {
  const service = vue.inject<vue.ShallowRef<T & StandardServices>>('service')

  if (!service)
    throw new Error('service for injection not found')

  return service.value
}
