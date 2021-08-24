const path = require("path")
const folders = ["@factor/ui", "@factor/plugin-notify"]

const resolveIfExists = (mod) => {
  let result = undefined
  try {
    result = require.resolve(mod)
  } catch (error) {
    const e = error
    if (e.code != "MODULE_NOT_FOUND") {
      throw error
    } else {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = error.message.match(/(?<=')(.*?)(?=')/g)

      if (!mod.includes(m)) {
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
    return `${parentFolder}/**/*.vue`
  })
  .filter((_) => _)

exports.paths = purgePath
