import "tailwindcss/tailwind.css"
import { FactorAppEntry } from "../config/types"
import { isNode } from "../utils"
import { compileApplication } from "../config/entry"

export const runViteApp = async (
  params: { renderUrl?: string } = {},
): Promise<FactorAppEntry> => {
  const { renderUrl } = params
  const { userConfig, mainFile } = await compileApplication({ isApp: true })
  const { factorApp } = mainFile

  if (!factorApp) {
    throw new Error("no factorApp exported from mainFile")
  }

  return await factorApp.mountApp({ renderUrl, userConfig })
}

/**
 * Run automatically in browser,
 * 'runViteApp' is called directly on server side for prerender
 */
if (!isNode()) {
  runViteApp().catch(console.error)
}
