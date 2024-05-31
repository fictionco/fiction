import type { ServiceConfig } from '../plugin-env'
import { createTestUtilServices } from './init'

const service = createTestUtilServices()

export function setup(): ServiceConfig {
  return {
    service,
    runVars: {},
    runCommand: async () => {},
    createMount: async (args) => {
      return await service.fictionApp.mountApp(args)
    },
  }
}
