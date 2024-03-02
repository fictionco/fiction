/* eslint-disable node/prefer-global/process */
import 'tailwindcss/tailwind.css'
import 'uno.css'
import { compileApplication } from '../plugin-env/entry'
import type { FictionAppEntry, MainFile } from '../plugin-env/types'
import type { RunVars } from '../inject'
import { isNode } from '../utils/vars'

declare global {
  interface Window {
    fictionRunVars: Partial<RunVars>
  }
}

// setup process env handling inside of app/browser
function setupGlobalRunVars<T extends keyof RunVars = keyof RunVars>() {
  if (typeof window !== 'undefined') {
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

async function runAppEntry(args: { renderRoute?: string, runVars?: Partial<RunVars> } = {}): Promise<FictionAppEntry | void> {
  const { renderRoute, runVars = window.fictionRunVars || {} } = args

  const context = 'app'

  try {
    // @ts-expect-error aliased module
    const mainFileImports = (await import('@MAIN_FILE_ALIAS')) as MainFile

    const serviceConfig = await mainFileImports.setup()
    if (!serviceConfig)
      throw new Error('No serviceConfig returned from setup')

    const service = await compileApplication({ context, serviceConfig, runVars })
    if (!service)
      throw new Error('No service returned from compileApplication')

    const mountArgs = { context, renderRoute, runVars, service, serviceConfig }
    return serviceConfig.createMount
      ? serviceConfig.createMount(mountArgs)
      : await mainFileImports.fictionApp?.mountApp(mountArgs)
  }
  catch (e) {
    console.error('Error in runAppEntry:', e)
    throw e // Rethrow to ensure the error is not silently ignored
  }
}

/**
 * Export entry for SSR
 */
export { runAppEntry }

/**
 * Run automatically in browser,
 * 'runAppEntry' is called directly on server side for prerender
 */
if (!isNode())
  runAppEntry().catch(e => console.error('Error running app entry:', e))
