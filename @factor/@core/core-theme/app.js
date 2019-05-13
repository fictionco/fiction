module.exports = Factor => {
  return new (class {
    constructor() {
      // const { theme } = Factor.FACTOR_APP_CONFIG
      // if (!theme) {
      //   return
      // }
      // this.themePackageName = theme
    }

    package() {
      // return this.themePackageName
    }
  })()
}
