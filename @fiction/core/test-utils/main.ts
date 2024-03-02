import type { ServiceConfig } from '../plugin-env'
import { createTestUtilServices } from './init'

const service = createTestUtilServices()

export function setup(): ServiceConfig {
  return {
    fictionEnv: service.fictionEnv,
    runCommand: async () => {},
    createService: async () => service,
    createMount: async (args) => {
      return await service.fictionApp.mountApp(args)
    },
  }
}
