module.exports = Factor => {
  return new class {
    constructor() {
      const { theme } = Factor.FACTOR_CONFIG

      this.themePackage = theme

      this.addPath()
      this.addWebpackConfig()
    }

    addPath() {
      const themePath = theme ? path.dirname(require.resolve(theme)) : Factor.$paths.get("app")

      Factor.$paths.add({
        theme: themePath
      })
    }

    package() {
      return this.themePackage
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
  }()
}
