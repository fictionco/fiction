import Factor from "@factor/core"

export async function importPlugins(plugins, { async = false } = {}) {
  for (let key of Object.keys(plugins)) {
    let plugin
    if (async) {
      const _module = await plugins[key]()
      plugin = _module.default
    } else {
      plugin = plugins[key]
    }

    installPlugin(key, plugin)
  }

  return
}

export function installPlugin(key, _module) {
  try {
    Factor[`$${key}`] = Factor.prototype[`$${key}`] =
      typeof _module == "function" ? _module(Factor) : _module
  } catch (error) {
    console.error(error)
  }

  return key
}
