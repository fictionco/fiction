export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.addFilter("content-routes", _ => {
        const routes = [
          {
            path: "/h",
            component: this.themeImport("home"),
            meta: { nav: true }
          }
        ]
        return _.concat(routes)
      })
    }

    themeImport(p) {
      let themeComponent
      try {
        themeComponent = () => import(`@/${p}`)
      } catch (error) {
        console.log("ER", error)
        themeComponent = () => import(`./${p}`)
      }
      return themeComponent
    }
  }()
}
