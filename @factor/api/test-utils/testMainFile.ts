import type { ServiceConfig } from '../plugin-env'
import { createTestUtilServices } from './init'

const service = createTestUtilServices()

export function setup(): ServiceConfig {
  return {
    factorEnv: service.factorEnv,

    createService: () => service,
    createMount: args => service.factorApp.mountApp(args),
  }
}
