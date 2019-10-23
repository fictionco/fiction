import Factor from "@factor/core"

// Import plugins and assure load order
export async function importPlugins(plugins) {
  for (let key of Object.keys(plugins)) {
    Factor[`$${key}`] = Factor.prototype[`$${key}`] = await importModule(plugins[key])
  }

  return
}

export async function importModule(importCaller) {
  const { default: _module } = await importCaller()

  const _export = typeof _module == "function" ? _module(Factor) : _module

  return await _export
}

export async function getExports(importers) {
  let _exports = {}

  for (let key of Object.keys(importers)) {
    _exports[key] = await importModule(importers[key])
  }

  return _exports
}
