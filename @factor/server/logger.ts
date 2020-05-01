import morgan from "morgan"
import figures from "figures"
import chalk from "chalk"
import { RequestHandler } from "express"
import { isBuilding } from "@factor/cli/loading"
import { blueChalk } from "@factor/cli/util"
/**
 * Log information for each server request
 */
export default (): RequestHandler =>
  morgan(
    (tokens, req, res) => {
      const details = []

      if (req.body.method) {
        const method = req.body.method
        const postType = req.body.params?.postType ?? ""
        const logDetail = req.body.params?.log ?? ""
        let log = ""
        if (logDetail) log = logDetail
        else if (postType) log = postType
        log = log ? `(${log})` : ""

        details.push(blueChalk(`${figures.arrowRight} ${method}${log}`))
      }

      const responseTime = tokens["response-time"](req, res)
      if (responseTime) {
        const millisecondResponseTime = Number.parseFloat(responseTime)
        const seconds = millisecondResponseTime / 1000
        const time = seconds.toFixed(3)

        details.push(`${time}s`)
      }

      const contentLength = Number.parseFloat(
        tokens.res(req, res, "content-length") ?? "-1"
      )
      if (contentLength) details.push(`Size: ${Math.round(contentLength / 1000)}kb`)

      details.push(`${tokens.method(req, res)}:${tokens.status(req, res)}`)

      let url = tokens.url(req, res)

      // Server requests to endpoints have null as the value for url
      // This is due to proxy
      if (url && url.includes("null")) {
        url = blueChalk(`server ${figures.arrowRight} ${url.split("null")[1]}`)
      }

      return `${blueChalk(figures.arrowUp)} Request ${blueChalk(url ?? "")} ${chalk.dim(
        details.join(" ")
      )}`
    },
    {
      skip: (request) => {
        if (isBuilding()) {
          return true
        }
        /**
         * Socket stuff is being rewritten to '/' so we use originalUrl
         */
        const { originalUrl } = request

        let { url } = request

        if (url.indexOf("?") > 0) url = url.slice(0, url.indexOf("?"))

        return originalUrl.includes("_loading") ||
          url.match(/(js|svg|jpg|png|css|json|woff|woff2|eot)$/gi) ||
          url.match(/__webpack_hmr/gi)
          ? true
          : false
      },
    }
  )
