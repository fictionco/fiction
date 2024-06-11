import { log } from '../plugin-log/index.js'
import type { RunVars } from '../inject.js'
import type { FictionObject, FictionPlugin } from '../plugin.js'
import type { CliVars, ServiceConfig, ServiceList } from './types.js'

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
    const { service } = serviceConfig

    /**
     * Don't run setup hooks multiple times in SSR, which creates memory leaks
     * This is because classes are cached, but setup hooks are not
     */
    if (!service.fictionEnv?.isCompiled?.value) {
      await runServicesSetup(service, args)
      service.fictionEnv.isCompiled.value = true
    }
    return service
  }
  catch (error: unknown) {
    log.error('compileApplication', 'plugin install error', { error })
  }
}
