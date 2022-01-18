import path from "path"

import { createRequire } from "module"

const require = createRequire(import.meta.url)

const folders = ["@factor/ui", "@factor/plugin-notify"]

const resolveIfExists = (mod: string): undefined | string | never => {
  let result = undefined
  try {
    result = require.resolve(mod)
  } catch (error) {
    const e = error as Error & { code: string }
    if (e.code != "MODULE_NOT_FOUND") {
      throw error
    } else {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = e.message.match(/(?<=')(.*?)(?=')/g)

      if (m && !m.includes(mod)) {
        throw error
      }
    }
  }

  return result
}

const purgePath = folders
  .map((mod) => {
    const fullPath = resolveIfExists(mod)
    if (!fullPath) return
    const f = path.dirname(fullPath).replace("@", "\\@")

    const parts = f.split("/")
    const parentFolder = parts.splice(0, parts.length - 1).join("/")
    return `${parentFolder}/**/*.{vue,html,ts}`
  })
  .filter((_) => _)

export const paths = purgePath
