import { createTestUtilServices } from './init'
import type { ServiceConfig } from '../plugin-env'

const service = createTestUtilServices()

export function setup(): ServiceConfig {
  return {
    service,
    runVars: {},
    runCommand: async () => {},
    createMount: async (args) => {
      return service.fictionApp.mountApp(args)
    },
  }
}
