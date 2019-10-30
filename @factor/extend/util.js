import Factor from "@factor/core"

// Import plugins and assure load order
export async function importPlugins(plugins) {
  const _modules = await getExports(plugins)

  for (let { _exports } of _modules) {
    const { default: defaultExport } = _exports

    if (defaultExport && typeof defaultExport == "function") {
      await defaultExport(Factor)
    }
  }

  return
}

export async function getExports(items) {
  return await Promise.all(
    Object.keys(items).map(async key => {
      let _exports
      try {
        _exports = await items[key]()
      } catch (error) {
        error.message = `Importing "${key}": ${error.message}`
        throw new Error(error)
      }

      return { key, _exports }
    })
  )
}
