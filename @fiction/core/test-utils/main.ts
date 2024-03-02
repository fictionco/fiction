import type { ServiceConfig } from '../plugin-env'
import { createTestUtilServices } from './init'

const service = createTestUtilServices()

export function setup(): ServiceConfig {
  return {
    factorEnv: service.factorEnv,
    runCommand: async () => {},
    createService: async () => service,
    createMount: async (args) => {
      return await service.factorApp.mountApp(args)
    },
  }
}
