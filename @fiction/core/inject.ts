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
  RENDER_TOKEN: string
  MOUNT_CONTEXT: Record<string, string>
  FICTION_ORG_ID: string // integrate db org with static
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
  BUILD_VERSION: string
  BUILD_COMMIT: string
}

// Core services that must be available
export interface CoreServices {
  fictionRouter: FictionRouter
  fictionUser: FictionUser
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionMedia: FictionMedia
  fictionDb: FictionDb
  fictionServer: FictionServer
  runVars?: RunVars
}

export type StandardServices = CoreServices & ServiceList

export function useService<T extends ServiceList>(): T & CoreServices {
  const service = vue.inject<vue.ShallowRef<T & CoreServices>>('service')

  if (!service)
    throw new Error('service for injection not found')

  return service.value
}

// Extensible service collection that allows adding new services
export interface ServiceCollection extends CoreServices {
  [key: string]: any
}

// Helper to add new services while maintaining types
export function addService<
  T extends ServiceCollection,
  K extends string,
  V,
>(services: T, key: K, value: V): T & Record<K, V> {
  return { ...services, [key]: value }
}

// Type helper to ensure we track the full type as we add services
export function createServiceCollection<T extends ServiceCollection>(initialServices: T) {
  let services = initialServices

  function addService<K extends string, V>(key: K, value: V): typeof services & Record<K, V> {
    services = { ...services, [key]: value } as typeof services & Record<K, V>
    return services
  }

  function getServices(): typeof services {
    return services
  }

  return {
    addService,
    getServices,
  }
}
