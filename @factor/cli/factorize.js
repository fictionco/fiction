import dotenv from "dotenv"
import { runCallbacks, addCallback } from "@factor/tools"
import aliasRequire from "./alias-require"
import transpiler from "./transpile"
import { resolve } from "path"
import commander from "commander"

export async function factorize(_arguments = {}) {
  const { parent = {}, ...rest } = _arguments
  const _config = { ...parent, ...rest }

  // Do this for every reset of server
  setEnvironment(_config)
  transpiler()
  aliasRequire()

  await extendServer(_config)

  // Filters must be reloaded with every new restart of server.
  // This adds the filter each time to allow for restart
  addCallback("rebuild-server-app", () => reloadNodeProcess(_config))
}

export function setEnvironment({ NODE_ENV = "production", command, ENV, PORT } = {}) {
  process.env.FACTOR_CWD = process.env.FACTOR_CWD || process.cwd()
  process.env.NODE_ENV = NODE_ENV
  process.env.FACTOR_ENV = ENV || process.env.FACTOR_ENV || NODE_ENV
  process.env.FACTOR_COMMAND = command || commander._name || "none"
  process.env.FACTOR_TARGET = "server"
  process.env.PORT = PORT || process.env.PORT || 3000
  dotenv.config({ path: resolve(process.env.FACTOR_CWD, ".env") })
}

export async function extendServer({ restart = false } = {}) {
  await runCallbacks("before-server-plugins")

  // eslint-disable-next-line import/no-unresolved
  require("~/.factor/loader-server")

  await runCallbacks("initialize-server")

  if (!restart) runCallbacks("after-first-server-extend")
}

// Reloads all cached node files
// Needed for server reloading
async function reloadNodeProcess(_arguments) {
  Object.keys(require.cache).forEach(id => {
    if (/(@|\.)factor/.test(id)) delete require.cache[id]
  })

  await factorize({ ..._arguments, restart: true, NODE_ENV: "development" })
}

// const passedArguments = process.argv.filter(_ => _.includes("--"))
