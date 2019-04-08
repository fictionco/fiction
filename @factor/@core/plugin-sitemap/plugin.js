export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.add("middleware", _ => {
        _.push({
          path: "/sitemap.xml",
          callback: async (req, res, next) => {
            const sitemap = await this.createSitemap()
            sitemap.toXML(function(err, xml) {
              if (err) {
                return res.status(500).end()
              }
              res.header("Content-Type", "application/xml")
              res.send(xml)
            })
          }
        })

        return _
      })
    }

    async getPermalinks() {
      const results = await Factor.$db.search({ collection: "public", limit: 1000 })

      const urls = results.data
        .filter(_ => _.permalink)
        .map(({ type, permalink }) => {
          return Factor.$posts.getPermalink({ type, permalink, root: false })
        })

      return urls
    }

    async createSitemap() {
      const urls = await this.getPermalinks()

      return require("sitemap").createSitemap({
        hostname: Factor.$config.setting("url"),
        cacheTime: 1000 * 60 * 60 * 24, // 600 sec - cache purge period
        urls
      })
    }
  }()
}
