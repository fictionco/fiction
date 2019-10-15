import Factor from "@factor/core"

export async function importPlugins(plugins) {
  for (let key of Object.keys(plugins)) {
    const { default: _module } = await plugins[key]()

    installPlugin(key, _module)
  }

  return
}

export function installPlugin(key, _module) {
  try {
    Factor.use({
      install(Factor) {
        const plugin = typeof _module == "function" ? _module(Factor) : _module
        Factor[`$${key}`] = Factor.prototype[`$${key}`] = plugin
      }
    })
  } catch (error) {
    console.error(error)
  }

  return key
}
