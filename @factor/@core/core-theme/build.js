module.exports = Factor => {
  return new (class {
    constructor() {
      const { theme } = Factor.FACTOR_CONFIG

      if (!theme) {
        return
      }

      this.themePackageName = theme

      if (Factor.FACTOR_ENV == "build") {
        this.addPath()

        // Allow module resolution
        this.addWebpackConfig()

        // The selected theme's plugin.js file should be loaded
        const { target: themeTarget = "" } = this.buildConfig()
        Factor.$filters.add("packages-loader", (load, { target, extensions }) => {
          if (Factor.$files.arrayIntersect(themeTarget, target)) {
            load.push(extensions.find(_ => _.module == this.themePackageName))
          }

          return load
        })

        // This allows for overriding of files from themes
        // Notes:
        // - Uses "#" as a flag to check a file, this is an alias for the theme root. The function replaces this with the app root.
        // - TODO if a file is added to app, then server needs a restart, fix should be possible
        Factor.$filters.add("webpack-plugins", (_, { webpack }) => {
          const plugin = new webpack.NormalModuleReplacementPlugin(/^\#/, resource => {
            const override = resource.request.replace("#", Factor.$paths.get("source"))

            const glob = require("glob").sync
            const overrideFiles = glob(`${override}*`)

            if (overrideFiles && overrideFiles.length == 1) {
              resource.request = overrideFiles[0]
            }
          })

          _.push(plugin)
          return _
        })
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
