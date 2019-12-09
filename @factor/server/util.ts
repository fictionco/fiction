import { setting, log } from "@factor/api"
import chalk from "chalk"
import express, { Handler, Request, Response } from "express"
import figures from "figures"

import expressPackage from "express/package.json"
import serverRendererPackage from "vue-server-renderer/package.json"

export const serverErrorWrap = ({ title = "", subTitle = "", description = "" }): string => {
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

export const getPort = (port: string | number): string | number => {
  return port || process.env.PORT || setting("PORT") || 3000
}

export const getServerInfo = (): string => {
  const { version: expressVersion } = expressPackage
  const { version: ssrVersion } = serverRendererPackage
  return `express/${expressVersion} vue-server-renderer/${ssrVersion}`
}

export const handleServerError = (
  request: Request,
  response: Response,
  error: Error
): void => {
  error.message = `Factor Server Error  @[${request.url}]: ${error.message}`

  log.error(error)

  const description = process.env.NODE_ENV == "development" ? error.message : ""

  response
    .status(500)
    .send(serverErrorWrap({ title: "500", subTitle: "Server Error", description }))
}

export const logServerReady = (): void => {
  const { arrowUp, arrowDown } = figures
  let readyText = ` ready... `

  if (process.env.NODE_ENV == "production") readyText += `at port ${process.env.PORT}`

  // eslint-disable-next-line no-console
  console.log(chalk.cyan(`${arrowUp}${arrowDown}`) + chalk.dim(readyText))
}

export const serveStatic = (path: string, cache: boolean): Handler => {
  const DAY = 1000 * 60 * 60 * 24
  return express.static(path, {
    maxAge: cache && process.env.NODE_ENV == "production" ? DAY : 0
  })
}
