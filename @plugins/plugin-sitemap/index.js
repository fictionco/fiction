import { getModel } from "@factor/post/server"
import { SitemapStream, streamToPromise } from "sitemap"
import { uniq, addFilter, applyFilters, getPermalink, log } from "@factor/tools"
import { createGzip } from "zlib"
import { currentUrl } from "@factor/tools/permalink"
let sitemap

addFilter("middleware", _ => {
  _.push({
    path: "/sitemap.xml",
    middleware: [
      async (request, response) => {
        // if we have a cached entry send it
        if (sitemap) {
          response.send(sitemap)
          return
        }
        try {
          const smStream = new SitemapStream({ hostname: currentUrl() })
          const pipeline = smStream.pipe(createGzip())

          const urls = await getPermalinks()

          urls.forEach(url => {
            smStream.write({ url })
          })

          smStream.end()

          // cache the response
          streamToPromise(pipeline).then(sm => (sitemap = sm))
          // stream the response
          pipeline.pipe(response).on("error", e => {
            throw e
          })
        } catch (error) {
          log.error(error)
          response.status(500).end()
        }
      }
    ]
  })

  return _
})

async function getPermalinks() {
  const posts = await getModel("post").find(
    { permalink: { $ne: null }, status: "published" },
    "permalink postType",
    { limit: 2000 }
  )

  const urls = posts.map(({ postType, permalink }) => {
    return getPermalink({ postType, permalink })
  })

  return urls.concat(getRouteUrls())
}

function getRouteUrls() {
  // get routes
  // then remove duplicated and dynamic routes (which include a colon (:))
  const contentRoutes = applyFilters("content-routes", [])
  const theRoutes = uniq(getRoutesRecursively(contentRoutes)).filter(
    perm => !perm.includes(":")
  )

  return theRoutes
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
