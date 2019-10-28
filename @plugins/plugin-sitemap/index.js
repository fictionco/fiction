import { getModel } from "@factor/post/server"
import { getPermalink } from "@factor/post"
import { uniq, addFilter, applyFilters } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      addFilter("middleware", _ => {
        _.push({
          path: "/sitemap.xml",
          middleware: [
            async (request, response, next) => {
              const sitemap = await this.createSitemap()
              sitemap.toXML(function(err, xml) {
                if (err) {
                  return response.status(500).end()
                }
                response.header("Content-Type", "application/xml")
                response.send(xml)
              })
            }
          ]
        })

        return _
      })
    }

    async getPermalinks() {
      const posts = await getModel("post").find(
        { permalink: { $ne: null }, status: "published" },
        "permalink postType",
        {
          limit: 2000
        }
      )

      const urls = posts.map(({ postType, permalink }) => {
        return getPermalink({ postType, permalink })
      })

      return urls.concat(this.getRouteUrls())
    }

    async createSitemap() {
      const urls = await this.getPermalinks()

      return require("sitemap").createSitemap({
        hostname: Factor.$setting.get("url"),
        cacheTime: 1000 * 60 * 60 * 24, // 600 sec - cache purge period
        urls
      })
    }

    getRouteUrls() {
      // get routes
      // then remove duplicated and dynamic routes (which include a colon (:))
      const contentRoutes = applyFilters("content-routes", [])
      const theRoutes = uniq(this.getRoutesRecursively(contentRoutes)).filter(
        perm => !perm.includes(":")
      )

      return theRoutes.map(perm => `${Factor.$setting.get("url")}${perm}`)
    }

    getRoutesRecursively(routes, parent = false) {
      let out = []

      routes
        .filter(_ => _.path !== "*")
        .forEach(_ => {
          if (_.path) {
            const _p =
              parent && !_.path.startsWith("/")
                ? `${parent}/${_.path}`
                : (parent && _.path == "/"
                ? parent
                : _.path)

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
