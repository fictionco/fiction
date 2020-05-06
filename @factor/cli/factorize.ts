import { resolve } from "path"
import dotenv from "dotenv"
import { runCallbacks, addCallback } from "@factor/api"

import log from "@factor/api/logger"
import { ServerOptions } from "@factor/server"
import aliasRequire from "./alias-require"
import transpile from "./transpile"
interface EnvironmentConfig {
  NODE_ENV?: string
  command?: string
  ENV?: string
  PORT?: string
  debug?: boolean
  restart?: boolean
}

/**
 * Sets Node process and environmental variables
 * @param _arguments - cli options
 */
export const setEnvironment = (_arguments: EnvironmentConfig = {}): void => {
  const { NODE_ENV, command, ENV, PORT, debug } = _arguments

  process.env.FACTOR_CWD = process.env.FACTOR_CWD || process.cwd()
  process.env.NODE_ENV = NODE_ENV || "production"
  process.env.FACTOR_ENV = ENV || process.env.FACTOR_ENV || process.env.NODE_ENV || ""
  process.env.FACTOR_DEBUG = debug ? "yes" : ""

  process.env.FACTOR_COMMAND = command || "none"
  process.env.FACTOR_TARGET = "server"
  process.env.PORT = PORT || process.env.PORT || "3000"
  dotenv.config({ path: resolve(process.env.FACTOR_CWD, ".env") })
}

/**
 * Extends the server and runs before/after callbacks
 * @param restart - if its a restart or initial run
 */
export const extendServer = async ({ restart = false } = {}): Promise<void> => {
  try {
    /**
     * Add functionality before plugins are installed and initialized
     * @callback
     */
    await runCallbacks("before-server-plugins")
  } catch (error) {
    log.error(error)
  }

  /**
   * Load the server module extensions that are auto-loaded
   */
  // eslint-disable-next-line import/no-unresolved
  require("__CWD__/.factor/loader-server")

  /**
   * Primary filter for extending the server environment w callbacks/filters/middleware
   * @callback
   */
  await runCallbacks("initialize-server")

  if (!restart) {
    /**
     * This filter will run only once on initial server setup, if server restarting is enabled it won't be run again
     * @callback
     */
    await runCallbacks("after-first-server-extend")
  }
}

/**
 * Configures and extends the factor server environment
 * @param _config - factor environment config
 */
export const factorize = async (_config: EnvironmentConfig = {}): Promise<void> => {
  // Do this for every reset of server
  setEnvironment(_config)
  if (!_config.restart) transpile()

  aliasRequire()

  await extendServer(_config)

  /**
   * Filters must be reloaded with every new restart of server as they are purged.
   * This adds the filter each time to allow for restart
   * @hook
   */
  addCallback({
    key: "nodeReloadModules",
    hook: "rebuild-server-app",
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    callback: (serverOptions: ServerOptions) => reloadNodeProcess(_config, serverOptions),
  })
}

/**
 * Reloads all cached node files
 * Needed for server reloading
 * @param _arguments - original arguments for factor cli
 */
const reloadNodeProcess = async (
  _arguments: EnvironmentConfig,
  serverOptions: ServerOptions
): Promise<void> => {
  if (!serverOptions.noReloadModules) {
    Object.keys(require.cache).forEach((id) => {
      if (!/node_modules/.test(id)) {
        delete require.cache[id]
      }
    })
  }

  await factorize({ ..._arguments, restart: true })
}
