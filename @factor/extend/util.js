import Factor from "@factor/core"

// Import plugins and assure load order
export async function importPlugins(plugins) {
  const _modules = await getExports(plugins)

  for (let { key, _exports } of _modules) {
    const { default: defaultExport, install } = _exports

    if (defaultExport && typeof defaultExport == "function") {
      Factor[`$${key}`] = Factor.prototype[`$${key}`] = await defaultExport(Factor)
    }

    if (install && typeof install == "function") {
      await install()
    }
  }

  return
}

export async function getExports(items) {
  return await Promise.all(
    Object.keys(items).map(async key => {
      let _exports
      try {
        _exports = await plugins[key]()
      } catch (error) {
        error.message = `Importing "${key}": ${error.message}`
        throw new Error(error)
      }

      return { key, _exports }
    })
  )
}
