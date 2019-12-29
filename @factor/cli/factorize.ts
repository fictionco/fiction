import { resolve } from "path"
import dotenv from "dotenv"
import { runCallbacks, addCallback } from "@factor/api"

import commander from "commander"
import log from "@factor/api/logger"
import aliasRequire from "./alias-require"
import transpile from "./transpile"

interface EnvironmentConfig {
  NODE_ENV?: string;
  command?: string;
  ENV?: string;
  PORT?: string;
  debug?: boolean;
  restart?: boolean;
}

export const setEnvironment = (_arguments: EnvironmentConfig = {}): void => {
  const { NODE_ENV, command, ENV, PORT, debug } = _arguments

  process.env.FACTOR_CWD = process.env.FACTOR_CWD || process.cwd()
  process.env.NODE_ENV = NODE_ENV || ""
  process.env.FACTOR_ENV = ENV || process.env.FACTOR_ENV || process.env.NODE_ENV || ""
  process.env.FACTOR_DEBUG = debug ? "yes" : ""

  process.env.FACTOR_COMMAND = command || commander._name || "none"
  process.env.FACTOR_TARGET = "server"
  process.env.PORT = PORT || process.env.PORT || "3000"
  dotenv.config({ path: resolve(process.env.FACTOR_CWD, ".env") })
}

export const extendServer = async ({ restart = false } = {}): Promise<void> => {
  try {
    await runCallbacks("before-server-plugins")
  } catch (error) {
    log.error(error)
  }

  // eslint-disable-next-line import/no-unresolved
  require("__CWD__/.factor/loader-server")

  await runCallbacks("initialize-server")

  if (!restart) runCallbacks("after-first-server-extend")
}

export const factorize = async (_config: EnvironmentConfig = {}): Promise<void> => {
  // Do this for every reset of server
  setEnvironment(_config)
  if (!_config.restart) transpile()

  aliasRequire()

  await extendServer(_config)

  // Filters must be reloaded with every new restart of server.
  // This adds the filter each time to allow for restart

  addCallback({
    key: "nodeReload",
    hook: "rebuild-server-app",
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    callback: ({ path }: { path: string }) => reloadNodeProcess(path, _config)
  })
}

// Reloads all cached node files
// Needed for server reloading
const reloadNodeProcess = async (
  path = "",
  _arguments: EnvironmentConfig
): Promise<void> => {
  if (path && require.cache[path]) {
    log.info(`reloading ${path} module`)

    delete require.cache[path]
  } else {
    Object.keys(require.cache).forEach(id => {
      if (/factor(?!.*node_modules)/.test(id)) {
        delete require.cache[id]
      }
    })
  }

  await factorize({ ..._arguments, restart: true, NODE_ENV: "development" })
}
