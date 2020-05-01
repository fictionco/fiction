import { setting, log, emitEvent } from "@factor/api"
import chalk from "chalk"
import express, { Handler, Request, Response } from "express"

import { localhostUrl } from "@factor/api/url"
import expressPackage from "express/package.json"
import serverRendererPackage from "vue-server-renderer/package.json"
import { renderLoading } from "@factor/loader"
/**
 * The error shown if a server error occurs and no HTML can be rendered
 * @param param0
 */
export const serverErrorWrap = ({
  title = "",
  subTitle = "",
  description = "",
}): string => {
  const lines = []

  if (title)
    lines.push(
      `<h1 style="font-size: 2.5em; line-height: 1.1;margin: 10px;">${title}</h1>`
    )
  if (subTitle)
    lines.push(
      `<h4 style="font-size: 1.1em; line-height: 1.1; margin: 10px;">${subTitle}</h4>`
    )
  if (description)
    lines.push(`<p style="margin-top: 2em; line-height: 1.4;">${description}</p>`)
  return `<div style="font-family: -apple-system, helvetica, arial;text-align: center;margin: 30vh auto; width: 500px; opacity:.2; ">${lines.join(
    ""
  )}</div>`
}

/**
 * Returns the passed in port, or returns the default
 * @param port - assign to port
 */
export const getPort = (port: string | number): string | number => {
  return port || process.env.PORT || setting("PORT") || 3000
}

/**
 * Information about the server for headers
 */
export const getServerInfo = (): string => {
  const { version: expressVersion } = expressPackage
  const { version: ssrVersion } = serverRendererPackage
  return `express/${expressVersion} vue-server-renderer/${ssrVersion}`
}

/**
 * Responds in a request with a standard HTTP error
 * @param request - express request
 * @param response - express response
 * @param error - the error that was thrown
 */
export const handleServerError = (
  request: Request,
  response: Response,
  error: Error
): void => {
  error.message = `Server Rendering Error \n url:${request.url}\n\n ${error.message}`

  log.error(error)

  emitEvent("buildError", error)

  response.status(500).send(renderLoading()).end()
}

export const logServerReady = (): void => {
  log.server(`Ready ${chalk.dim(`at ${localhostUrl()}`)}`)
}
/**
 * Serve static assets at a path
 * @param path - the path to assets directory
 * @param cache - should they be cached
 */
export const serveStatic = (path: string, cache = true): Handler => {
  const DAY = 1000 * 60 * 60 * 24
  return express.static(path, {
    maxAge: cache && process.env.NODE_ENV !== "development" ? DAY : 0,
  })
}
