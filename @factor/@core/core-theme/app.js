module.exports = Factor => {
  return new class {
    constructor() {
      const { theme } = Factor.FACTOR_CONFIG

      if (!theme) {
        return
      }

      this.themePackageName = theme
    }

    package() {
      return this.themePackageName
    }
  }()
}
