export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("middleware", _ => {
        _.push({
          path: "/sitemap.xml",
          callback: async (request, response, next) => {
            const sitemap = await this.createSitemap()
            sitemap.toXML(function(err, xml) {
              if (err) {
                return response.status(500).end()
              }
              response.header("Content-Type", "application/xml")
              response.send(xml)
            })
          }
        })

        return _
      })
    }

    async getPermalinks() {
      const results = await Factor.$db.run({ method: "find", conditions: {}, limit: 1000 })

      const urls = results.data
        .filter(_ => _.permalink)
        .map(({ type, permalink }) => {
          return Factor.$posts.getPermalink({ type, permalink, root: false })
        })

      return urls.concat(this.getRouteUrls())
    }

    async createSitemap() {
      const urls = await this.getPermalinks()

      return require("sitemap").createSitemap({
        hostname: Factor.$config.setting("url"),
        cacheTime: 1000 * 60 * 60 * 24, // 600 sec - cache purge period
        urls
      })
    }

    getRouteUrls() {
      // get routes
      // then remove duplicated and dynamic routes (which include a colon (:))
      const contentRoutes = Factor.$filters.apply("content-routes", [])
      const theRoutes = Factor.$lodash
        .uniq(this.getRoutesRecursively(contentRoutes))
        .filter(perm => !perm.includes(":"))

      // console.log("content routes", contentRoutes)
      return theRoutes.map(perm => `${Factor.$config.setting("url")}${perm}`)
    }

    getRoutesRecursively(routes, parent = false) {
      let out = []

      routes
        .filter(_ => _.path !== "*")
        .forEach(_ => {
          if (_.path) {
            const _p =
              parent && !_.path.startsWith("/") ? `${parent}/${_.path}` : parent && _.path == "/" ? parent : _.path

            out.push(_p)
          }

          if (_.children) {
            out = [...out, ...this.getRoutesRecursively(_.children, _.path)]
          }
        })

      return out
    }
  })()
}
