import { createTestUtils } from './init'
import type { ServiceConfig } from '../plugin-env'

export function setup(args: { envFiles?: string[], context?: 'node' | 'app' }) {
  // so app mount can find its way back

  const mainFilePath = new URL(import.meta.url).pathname
  const service = createTestUtils({ mainFilePath, ...args })

  return {
    service,
    runVars: {},
    createMount: async args => service.fictionApp.mountApp(args),
    runCommand: async args => service.runApp(args),
    close: async () => service.close(),
  } satisfies ServiceConfig
}
