/* eslint-disable node/prefer-global/process */
import type { RunVars } from '../inject'
import type { FictionAppEntry, MainFile, ServiceConfig } from '../plugin-env/types'
import { compileApplication } from '../plugin-env/entry'
import { log } from '../plugin-log'
import { isNode } from '../utils/vars'
import 'tailwindcss/tailwind.css'

const logger = log.contextLogger('Mount')

declare global {
  interface Window {
    fictionRunVars: Partial<RunVars> & { [key: string]: string | undefined | Record<string, string> }
  }
}

// setup process env handling inside of app/browser
function setupGlobalRunVars<T extends keyof RunVars = keyof RunVars>() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // @ts-expect-error (avoid confusion with node process.env)
    window.process ||= { env: {} }
    window.fictionRunVars ||= {}

    const runVarsJSON = document.querySelector('#fictionRun')?.textContent
    const runVarsParsed = runVarsJSON ? JSON.parse(runVarsJSON) as Record<string, RunVars[T]> : {}

    Object.entries(runVarsParsed).forEach(([key, value]) => {
      window.process.env[key] = typeof value === 'string' ? value : 'not_string'
      window.fictionRunVars[key as T] = value
    })
  }
}

setupGlobalRunVars()

async function getMainFile() {
  // @ts-expect-error aliased module
  return (await import('@MAIN_FILE_ALIAS')) as MainFile
}

async function getServiceConfig(args: { runVars: Partial<RunVars> }): Promise<ServiceConfig> {
  const { runVars } = args

  const mainFileImports = await getMainFile()

  const serviceConfig = await mainFileImports.setup({ context: 'app' })
  if (!serviceConfig)
    throw new Error('No serviceConfig returned from mainfile setup')

  await compileApplication({ context: 'app', serviceConfig, runVars })
  serviceConfig.runVars = runVars

  return serviceConfig
}

async function runAppEntry(args: { renderRoute?: string, serviceConfig: ServiceConfig }): Promise<FictionAppEntry | undefined> {
  const { renderRoute, serviceConfig } = args

  const context = 'app'

  try {
    const mountArgs = { context, renderRoute, serviceConfig }
    const appEntry = await serviceConfig.createMount?.(mountArgs)

    if (!appEntry)
      throw new Error('No appEntry returned from createMount')

    return appEntry
  }
  catch (error) {
    logger.error('Error in runAppEntry:', { error })
    throw error // Rethrow to ensure the error is not silently ignored
  }
}

async function runEntryBrowser() {
  const runVars = window.fictionRunVars || {}
  const serviceConfig = await getServiceConfig({ runVars })
  runAppEntry({ serviceConfig }).catch(e => console.error('Error running app entry:', e))
}

async function runEntrySRR(args: { runVars: Partial<RunVars> }) {
  const { runVars } = args
  const serviceConfig = await getServiceConfig({ runVars })

  return runAppEntry({ serviceConfig })
}

/**
 * Export entry for SSR
 */
export { runEntrySRR }

/**
 * Run automatically in browser,
 * 'runAppEntry' is called directly on server side for prerender
 */
if (!isNode()) {
  runEntryBrowser().catch(e => console.error('Error running browser entry:', e))
}
