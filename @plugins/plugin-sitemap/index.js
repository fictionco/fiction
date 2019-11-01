import { getModel } from "@factor/post/server"

import { uniq, addFilter, applyFilters, setting, getPermalink } from "@factor/tools"

addFilter("middleware", _ => {
  _.push({
    path: "/sitemap.xml",
    middleware: [
      async (request, response) => {
        const sitemap = await createSitemap()
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

async function getPermalinks() {
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

  return urls.concat(getRouteUrls())
}

async function createSitemap() {
  const urls = await getPermalinks()

  return require("sitemap").createSitemap({
    hostname: setting("url"),
    cacheTime: 1000 * 60 * 60 * 24, // 600 sec - cache purge period
    urls
  })
}

function getRouteUrls() {
  // get routes
  // then remove duplicated and dynamic routes (which include a colon (:))
  const contentRoutes = applyFilters("content-routes", [])
  const theRoutes = uniq(getRoutesRecursively(contentRoutes)).filter(
    perm => !perm.includes(":")
  )

  return theRoutes.map(perm => `${setting("url")}${perm}`)
}

function getRoutesRecursively(routes, parent = false) {
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
        out = [...out, ...getRoutesRecursively(_.children, _.path)]
      }
    })

  return out
}
