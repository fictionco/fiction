import { vue } from './utils'
import type { FactorApp } from './plugin-app'
import type { FactorRouter } from './plugin-router'
import type { FactorUser } from './plugin-user'
import type { FactorEnv, ServiceList } from './plugin-env'
import type { FactorMedia } from './plugin-media'
import type { FactorDb } from './plugin-db'
import type { FactorServer } from './plugin-server'

export type RunVars = {
  APP_INSTANCE: string
  MOUNT_CONTEXT: Record<string, string>
  SITE_ID: string
  APP_PORT: string
  COMMAND: string
  COMMAND_OPTS: string
  GOOGLE_CLIENT_ID: string
  HOST: string
  HOSTNAME: string
  IP_ADDRESS: string
  IS_VITE: string
  NODE_ENV: string
  PATHNAME: string
  PROTOCOL: string
  RUNTIME_COMMIT: string
  RUNTIME_VERSION: string
  SERVER_PORT: string
  SUBDOMAIN: string
  USER_AGENT: string
  ORIGIN: string
  URL: string
}

export type StandardServices = {
  factorRouter: FactorRouter
  factorUser: FactorUser
  factorEnv: FactorEnv
  factorApp: FactorApp
  factorMedia: FactorMedia
  factorDb: FactorDb
  factorServer: FactorServer
  runVars?: RunVars
} & ServiceList

export function useService<T extends ServiceList>(): T & StandardServices {
  const service = vue.inject<vue.ShallowRef<T & StandardServices>>('service')

  if (!service)
    throw new Error('service for injection not found')

  return service.value
}
