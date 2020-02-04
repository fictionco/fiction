import morgan from "morgan"
import figures from "figures"
import chalk from "chalk"
import { RequestHandler } from "express"

/**
 * Log information for each server request
 */
export default (): RequestHandler =>
  morgan(
    (tokens, req, res) => {
      const millisecondResponseTime = parseFloat(tokens["response-time"](req, res))
      const seconds = millisecondResponseTime / 1000
      const time = seconds.toFixed(3)
      const details = []

      if (req.body.method) {
        details.push(chalk.cyan(`${figures.arrowRight} ${req.body.method}`))
      }

      details.push(`${time}s`)

      const contentLength = parseFloat(tokens.res(req, res, "content-length"))
      if (contentLength) details.push(`Size: ${Math.round(contentLength / 1000)}kb`)

      details.push(`${tokens.method(req, res)}:${tokens.status(req, res)}`)

      let url = tokens.url(req, res)

      // Server requests to endpoints have null as the value for url
      // This is due to proxy
      if (url.includes("null")) {
        url = chalk.cyan(`server ${figures.arrowRight} ${url.split("null")[1]}`)
      }

      return `${chalk.cyan(figures.arrowUp) +
        chalk.cyan(figures.arrowDown)} Request @ ${chalk.cyan(url)} ${chalk.dim(
        details.join(" ")
      )}`
    },
    {
      skip: request => {
        let { url } = request
        if (url.indexOf("?") > 0) url = url.slice(0, url.indexOf("?"))

        return url.match(/(js|svg|jpg|png|css|json)$/gi) || url.match(/__webpack_hmr/gi)
          ? true
          : false
      }
    }
  )
