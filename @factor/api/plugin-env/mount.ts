import "tailwindcss/tailwind.css"
// eslint-disable-next-line import/no-unresolved
import "uno.css"
import { FactorAppEntry } from "./types"
import { isNode } from "../utils"
import { compileApplication } from "./entry"

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
if (!isNode()) {
  runViteApp().catch(console.error)
}
