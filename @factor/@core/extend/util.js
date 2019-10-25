import Factor from "@factor/core"

// Import plugins and assure load order
export async function importPlugins(plugins) {
  const _modules = await Promise.all(
    Object.keys(plugins).map(async key => {
      const _exports = await plugins[key]()
      return { key, _exports }
    })
  )

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

export async function importModule(key, importCaller) {
  const __exports = await importCaller()

  const { default: _default } = __exports

  const _export = typeof _default == "function" ? _default(Factor) : _default

  return await { key, _export }
}

export async function getExports(importers) {
  let _exports = {}

  for (let _key of Object.keys(importers)) {
    const { _export } = await importModule(_key, importers[_key])

    _exports[_key] = _export
  }

  return _exports
}
