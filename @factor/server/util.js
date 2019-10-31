import { setting, log } from "@factor/tools"
import chalk from "chalk"
import express from "express"
import figures from "figures"

export function serverErrorWrap(txt) {
  return `<h1 style="font-family: -apple-system, helvetica, arial;text-align: center;margin: 2em; opacity:.1; font-weight: 400;">${txt}</h1>`
}

export function getPort(port) {
  return port || process.env.PORT || setting("PORT") || 3000
}

export function getServerInfo() {
  const { version: expressVersion } = require("express/package.json")
  const { version: ssrVersion } = require("vue-server-renderer/package.json")
  return `express/${expressVersion} vue-server-renderer/${ssrVersion}`
}

export function handleServerError(request, response, error) {
  if (error.url) {
    response.redirect(error.url)
  } else if (error.code === 404) {
    response.status(404).send("404 | Page Not Found")
  } else {
    log.info(`Factor Server Error  @[${request.url}]`)
    log.error(error)

    response.status(500).send(serverErrorWrap("500 | Server Error"))
  }
}

export function logServerReady() {
  const { arrowUp, arrowDown } = figures
  log.info(chalk.cyan(`${arrowUp}${arrowDown}`) + chalk.dim(` ready`))
}

export function serveStatic(path, cache) {
  return express.static(path, {
    maxAge: cache && process.env.NODE_ENV == "production" ? 1000 * 60 * 60 * 24 : 0
  })
}
