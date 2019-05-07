const { pathExistsSync } = require("fs-extra")
const glob = require("glob").sync
module.exports = Factor => {
  return new (class {
    constructor() {
      const { theme } = Factor.FACTOR_CONFIG

      this.themePackageName = theme || ""

      this.addPath()

      // Allow module resolution
      this.addWebpackConfig()

      // This allows for overriding of files from themes
      // Notes:
      // - Uses "#" as a flag to check a file, this is an alias for the theme root. The function replaces this with the app root.
      // - TODO if a file is added to app, then server needs a restart, fix should be possible
      Factor.$filters.add("webpack-plugins", (_, { webpack }) => {
        const plugin = new webpack.NormalModuleReplacementPlugin(/^\#/, resource => {
          const src = Factor.$paths.get("source")
          const theme = Factor.$paths.get("theme")

          const appPath = this._fileExists(resource.request.replace("#", src))
          const themePath = this._fileExists(resource.request.replace("#", theme))
          const fallback = this._fileExists(resource.request.replace("#", resource.context))

          if (appPath) {
            resource.request = appPath
          } else if (themePath) {
            resource.request = themePath
          } else if (fallback) {
            resource.request = fallback
          } else {
            throw new Error(`A requested module is missing`)
          }
        })

        _.push(plugin)
        return _
      })
    }

    _fileExists(path) {
      const basePath = path.split("?")[0]
      const query = path.split("?")[1] || ""
      if (query && pathExistsSync(basePath)) {
        return path
      } else {
        const files = glob(`${basePath}*`)
        if (files && files.length == 1) {
          return files[0]
        } else {
          return false
        }
      }
    }

    addPath() {
      const { dirname } = require("path")
      const themePath = this.themePackageName
        ? dirname(require.resolve(this.themePackageName))
        : Factor.$paths.get("app")

      Factor.$paths.add({
        theme: themePath
      })
    }

    package() {
      return this.themePackageName
    }

    addWebpackConfig() {
      // if (this.theme) {
      //   Factor.$filters.add("package-webpack-config", _ => {
      //     _.resolve = {
      //       modules: [Factor.$paths.get("source"), Factor.$paths.get("theme"), "node_modules"]
      //     }
      //     return _
      //   })
      // }
    }

    buildConfig() {
      const { factor } = require(`${this.themePackageName}/package.json`)

      return factor
    }
  })()
}
