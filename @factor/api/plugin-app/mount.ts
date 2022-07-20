import "tailwindcss/tailwind.css"
// eslint-disable-next-line import/no-unresolved
import "uno.css"
import { isNode } from "../utils"
import { compileApplication } from "../plugin-env/entry"
import type { FactorAppEntry } from "../plugin-env/types"

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
  // prevent 'process' not defined errors in browser
  if (typeof window.process == "undefined") {
    // @ts-ignore (avoid confusion with node process.env)
    window.process = { env: {} }
  }

  runViteApp().catch(console.error)
}
