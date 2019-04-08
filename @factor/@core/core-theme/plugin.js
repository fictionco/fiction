module.exports = Factor => {
  return new class {
    constructor() {
      const { theme } = Factor.FACTOR_CONFIG

      if (!theme) {
        return
      }

      this.themePackageName = theme

      if (Factor.FACTOR_ENV == "build") {
        this.addPath()
        this.addWebpackConfig()
        const { target: themeTarget = "" } = this.buildConfig()
        Factor.$filters.add("packages-loader", (load, { target, extensions }) => {
          if (Factor.$files.arrayIntersect(themeTarget, target)) {
            load.push(extensions.find(_ => _.module == this.themePackageName))
          }

          return load
        })
      }
    }

    addPath() {
      const { dirname } = require("path")
      const themePath = this.themePackageName
        ? dirname(require.resolve(`${this.themePackageName}`))
        : Factor.$paths.get("app")

      Factor.$paths.add({
        theme: themePath
      })
    }

    package() {
      return this.themePackageName
    }

    addWebpackConfig() {
      if (this.theme) {
        Factor.$filters.add("package-webpack-config", _ => {
          _.resolve = {
            modules: [Factor.$paths.get("app"), Factor.$paths.get("theme"), "node_modules"]
          }

          return _
        })
      }
    }

    buildConfig() {
      const { factor } = require(`${this.themePackageName}/package.json`)

      return factor
    }

    addToLoader() {}
  }()
}
