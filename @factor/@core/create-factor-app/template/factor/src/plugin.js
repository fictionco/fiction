// This is the standard format for a Factor extension
// Use this file to add routes, global components, config, etc.
module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        this.pageBg = this.randomBg()

        _.push({
          path: "/",
          component: () => import("./v-home")
        })

        _.push({
          path: "/example",
          component: () => import("./v-example"),
          meta: {
            style: { backgroundImage: this.pageBg, backgroundColor: "#111111", color: "#ffffff" }
          }
        })

        return _
      })
    }

    randomBg() {
      const bgImages = [
        require(`./img/bg1.jpg`),
        require(`./img/bg2.jpg`),
        require(`./img/bg3.jpg`),
        require(`./img/bg4.jpg`)
      ]
      return bgImages[Math.floor(Math.random() * bgImages.length)]
    }
  })()
}
