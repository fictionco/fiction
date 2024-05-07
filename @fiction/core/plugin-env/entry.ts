import { log } from '../plugin-log'
import type { RunVars } from '../inject'
import type { FictionObject, FictionPlugin } from '../plugin'
import type { CliVars, ServiceConfig, ServiceList } from './types'

type ServiceSetupArgs = { serviceConfig: ServiceConfig } & ({ context: 'app', runVars: Partial<RunVars> } | { context: 'node', cliVars: Partial<CliVars> })

function isPlugin(object: any): object is FictionPlugin | FictionObject {
  return typeof object?.setup === 'function'
}

/**
 * Run plugin setup and afterSetup hooks
 */
export async function runServicesSetup(service: ServiceList, args: { context: 'app' | 'node' | 'test' }): Promise<void> {
  const pluginList = Object.values(service).filter(isPlugin)

  if (pluginList.length > 0) {
    const setupPhases = ['beforeSetup', 'setup', 'afterSetup'] as const

    for (const phase of setupPhases) {
      for (const plugin of pluginList) {
        try {
          await plugin[phase](args)
        }
        catch (error: unknown) {
          const e = error as Error
          const name = plugin.constructor.name ?? 'unknown'
          e.message = `plugin ${phase} error (${name}): ${e.message}`
          throw e
        }
      }
    }
  }
}

/**
 * Get service running the createService hook and then run setup hooks
 */
export async function compileApplication(args: ServiceSetupArgs): Promise<ServiceList | undefined> {
  const { serviceConfig } = args
  try {
    const { createService } = serviceConfig

    /**
     * Create final service for app or node
     */
    const service: ServiceList = createService ? await createService(args) : {}

    await runServicesSetup(service, args)

    return service
  }
  catch (error: unknown) {
    log.error('compileApplication', 'plugin install error', { error })
  }
}
