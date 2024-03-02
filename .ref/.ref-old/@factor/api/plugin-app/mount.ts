import "tailwindcss/tailwind.css"
// eslint-disable-next-line import/no-unresolved
import "uno.css"
import { compileApplication } from "../plugin-env/entry"
import type { FactorAppEntry } from "../plugin-env/types"

// public env vars are added here at build time
const renderedEnvVars = "VITE_REPLACE_ENV_VARS"

// setup process env handling inside of app/browser
const setupRenderedEnvVars = () => {
  let runtime: Record<string, string> | undefined = undefined
  // prevent 'process' not defined errors in browser
  if (typeof window !== "undefined") {
    if (typeof window.process == "undefined") {
      // @ts-ignore (avoid confusion with node process.env)
      window.process = { env: {} }
    }

    const run = document.querySelector("#factorRun")?.textContent

    if (run) {
      runtime = JSON.parse(run) as Record<string, string>
    }

    const rendered = JSON.parse(renderedEnvVars) as Record<string, string>

    const buildVars = { ...rendered, ...runtime }

    // browser only this can affect global process in SSR/prerendering
    Object.entries(buildVars).forEach(([key, value]) => {
      process.env[key] = value
    })
  }
}

setupRenderedEnvVars()

export const runViteApp = async (
  params: { renderUrl?: string } = {},
): Promise<FactorAppEntry> => {
  const { renderUrl } = params

  const { serviceConfig, mainFile, mainFilePath } = await compileApplication({
    isApp: true,
  })
  const { factorApp } = mainFile

  if (!factorApp) {
    throw new Error(`no factorApp exported from mainFile: ${mainFilePath}`)
  }
  return await factorApp.mountApp({ renderUrl, serviceConfig })
}

/**
 * Run automatically in browser,
 * 'runViteApp' is called directly on server side for prerender
 */
if (typeof window !== "undefined") {
  runViteApp().catch(console.error)
}
