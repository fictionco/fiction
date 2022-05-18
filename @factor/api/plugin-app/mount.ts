import "tailwindcss/tailwind.css"
// eslint-disable-next-line import/no-unresolved
import "uno.css"
import { FactorAppEntry } from "../plugin-env/types"
import { isNode } from "../utils"
import { compileApplication } from "../plugin-env/entry"

export const runViteApp = async (
  params: { renderUrl?: string } = {},
): Promise<FactorAppEntry> => {
  const { renderUrl } = params
  const { serviceConfig, mainFile } = await compileApplication({ isApp: true })
  const { factorApp } = mainFile

  if (!factorApp) {
    throw new Error("no factorApp exported from mainFile")
  }

  return await factorApp.mountApp({ renderUrl, serviceConfig })
}

/**
 * Run automatically in browser,
 * 'runViteApp' is called directly on server side for prerender
 */
if (!isNode()) {
  runViteApp().catch(console.error)
}
