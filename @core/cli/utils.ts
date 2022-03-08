import path from "path"
import { logger } from "@factor/api"
import dotenv from "dotenv"
export type BuildStages = "prod" | "pre" | "local"

export type CliOptions = {
  name?: string
  SERVICE?: string
  STAGE_ENV?: BuildStages
  NODE_ENV?: "production" | "development"
  inspector?: boolean
  exit?: boolean
  portApp?: string
  port?: string
  serve?: boolean
  prerender?: boolean
  patch?: boolean
  skipTests?: boolean
  moduleName?: string
  cwd?: string
}

export const done = (code: 0 | 1, log = `exited process`): never => {
  if (log) {
    logger.log({
      level: code == 0 ? "info" : "error",
      context: "cli",
      description: `${log} (${code})`,
    })
  }

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(code)
}

/**
 * Opens the node inspector port
 * https://nodejs.org/api/inspector.html
 */
const initializeNodeInspector = async (): Promise<void> => {
  logger.log({
    level: "info",
    context: "cli",
    description: `[initializing inspector]`,
  })
  const inspector = await import("inspector")
  inspector.close()
  inspector.open()
}

/**
 * Sets Node process and environmental variables
 */
export const setEnvironment = (options: CliOptions): void => {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") })

  if (options.NODE_ENV == "development") {
    dotenv.config({ path: path.resolve(process.cwd(), ".dev.env") })
  }

  if (process.env.TEST_ENV) {
    dotenv.config({ path: path.resolve(process.cwd(), ".test.env") })
  }

  const { NODE_ENV, STAGE_ENV, portApp, port, inspector } = options

  process.env.NODE_ENV = NODE_ENV || "production"
  process.env.STAGE_ENV = STAGE_ENV || "prod"

  // set up port handling
  process.env.FACTOR_APP_PORT = portApp || "3000"
  process.env.FACTOR_SERVER_PORT = port || "3210"

  // run with node developer tools inspector
  if (inspector) {
    initializeNodeInspector().catch((error) => console.error(error))
  }
}

/**
 * Standard wrap for a CLI command that exits and sanitizes input args
 */
export const wrapCommand = async (params: {
  cb: (options: CliOptions) => Promise<void>
  opts?: CliOptions
}): Promise<void> => {
  const { cb, opts = {} } = params
  const { exit } = opts

  setEnvironment(opts)

  try {
    await cb(opts)
  } catch (error) {
    logger.log({
      level: "error",
      context: "wrapCommand",
      description: "command execution error",
      error,
      data: opts,
    })
    done(1)
  }
  if (exit) done(0)
}
