import type { ServiceConfig } from '../plugin-env'
import { createTestUtilServices } from './init'

const service = createTestUtilServices()

export function setup(): ServiceConfig {
  return {
    fictionEnv: service.fictionEnv,

    createService: () => service,
    createMount: args => service.fictionApp.mountApp(args),
  }
}
