import { emitEvent, logger } from "@factor/api"
import { Command, OptionValues } from "commander"
import dotenv from "dotenv"
import path from "path"
import pkg from "./package.json"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

type EntryFile = { setup: (options: CliOptions) => Promise<void> }

const commander = new Command()

export enum ServiceModule {
  Server = "@factor/server",
  Render = "@factor/render",
}

export enum ServicePort {
  Server = "3210",
  Render = "3000",
}

export const coreServices = {
  server: { port: ServicePort.Server, service: ServiceModule.Server },
  render: { port: ServicePort.Render, service: ServiceModule.Render },
}

type BuildStages = "prod" | "pre" | "local"

export type CliOptions = {
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
}
/**
 * Is current start a nodemon restart
 */
export const isRestart = (): boolean => {
  return process.env.IS_RESTART == "1"
}
/**
 * CLI is done, exit process
 */
export const done = (code: 0 | 1): never => {
  logger.log({
    level: code == 0 ? "info" : "error",
    context: "cli",
    description: `process exited (${code})`,
  })

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
  process.env.STAGE_ENV = STAGE_ENV || "local"

  // set up port handling
  process.env.FACTOR_APP_PORT = portApp || "3000"
  process.env.PORT = process.env.FACTOR_SERVER_PORT = port || "3210"

  // run with node developer tools inspector
  if (inspector) {
    initializeNodeInspector().catch((error) => console.error(error))
  }
}

/**
 * For commands that use Nodemon to handle restarts
 */
const restartInitializer = async (options: OptionValues): Promise<void> => {
  const { default: nodemon } = await import("nodemon")

  setEnvironment(options as CliOptions)

  const conf = require("./nodemon.json") as Record<string, any>

  const passArgs = commander.args

  passArgs.shift()

  const script = `npm exec -c 'factor rdev ${passArgs.join(" ")}'`
  conf.exec = script

  /**
   * The nodemon function takes either an object (that matches the nodemon config)
   * or can take a string that matches the arguments that would be used on the command line
   */
  nodemon(conf)

  nodemon
    .on("log", () => {})
    .on("start", () => {})
    .on("quit", () => done(0))
    .on("restart", (files: string[]) => {
      process.env.IS_RESTART = "1"
      logger.log({
        level: "info",
        context: "nodemon",
        description: "restarted due to:",
        data: { files },
      })
    })
}
/**
 * Runs a command entered in the CLI
 * @param options - command options
 */
export const runService = async (options: CliOptions): Promise<void> => {
  const { SERVICE } = options

  if (!SERVICE) {
    throw new Error(`no service argument is set (--SERVICE)`)
  }

  const { setup } = (await import(SERVICE)) as EntryFile

  if (setup) {
    await setup(options)
  }

  return
}
/**
 * Runs the endpoint server for CWD app
 */
export const runServer = async (options: CliOptions): Promise<void> => {
  return runService({ SERVICE: ServiceModule.Server, ...options })
}
/**
 * Run development environment for CWD app
 */
export const runDev = async (options: CliOptions): Promise<void> => {
  for (const { service } of Object.values(coreServices)) {
    const { setup } = (await import(service)) as EntryFile

    if (setup) {
      await setup(options)
    }
  }
}
/**
 * Standard wrap for a CLI command that exits and sanitizes input args
 */
const wrapCommand = async (settings: {
  NODE_ENV?: "production" | "development"
  cb: (options: CliOptions) => Promise<void>
  exit?: boolean
  opts?: CliOptions
}): Promise<void> => {
  const { cb, exit, NODE_ENV, opts = commander.opts() as CliOptions } = settings
  opts.NODE_ENV = NODE_ENV

  setEnvironment(opts)

  try {
    await cb(opts)
  } catch (error) {
    logger.log({
      level: "error",
      context: "wrapCommand",
      description: "command execution error",
      data: error,
    })
    done(1)
  }
  if (exit) done(0)
}
/**
 * Handle the CLI using Commander
 * Set up initial Node environment
 */
export const execute = (): void => {
  commander
    .version(pkg.version)
    .description("Factor CLI")
    .option("--SERVICE <SERVICE>", "Which module to run")
    .option("--STAGE_ENV <string>", "how should the things be built")
    .option("--NODE_ENV <string>", "environment (development/production)")
    .option("--exit", "exit after successful setup")
    .option("--inspector", "run the node inspector")
    .option("-a, --port-app <number>", "primary service port")
    .option("-p, --port <number>", "server specific port")
    .option("-s, --serve", "serve static site after build")

    .option(
      "--NODE_ENV <NODE_ENV>",
      "node environment (development or production)",
    )

  commander.command("start").action(async () => {
    const opts = commander.opts() as CliOptions
    await wrapCommand({ cb: (_) => runService(_), opts })
  })

  commander.command("server").action(async () => {
    await wrapCommand({
      cb: (_) => runServer(_),
    })
  })

  commander
    .command("dev")
    .allowUnknownOption()
    .action(() => {
      const opts = commander.opts() as CliOptions
      return restartInitializer(opts)
    })

  commander.command("rdev").action(() => {
    const opts = commander.opts() as CliOptions

    return wrapCommand({
      cb: (_) => runDev(_),
      NODE_ENV: "development",
      exit: opts.exit ?? false,
      opts: commander.opts(),
    })
  })

  commander
    .command("build")
    .option("--prerender", "prerender pages")
    .action(() => {
      const opts = commander.opts() as CliOptions
      return wrapCommand({
        cb: async (opts) => {
          const { buildApp } = await import("@factor/render")
          await runServer(opts)
          return buildApp(opts)
        },
        NODE_ENV: opts.NODE_ENV ?? "production",
        exit: opts.serve ? false : true,
        opts,
      })
    })

  commander.command("prerender").action(() => {
    const opts = commander.opts() as CliOptions
    return wrapCommand({
      cb: async (opts) => {
        opts.prerender = true
        const { buildApp } = await import("@factor/render")
        await runServer(opts)
        return buildApp(opts)
      },
      NODE_ENV: opts.NODE_ENV || "production",
      exit: opts.serve ? false : true,
      opts,
    })
  })

  commander.command("serve").action(() => {
    const opts = commander.opts() as CliOptions
    return wrapCommand({
      cb: async (opts) => {
        const { serveApp } = await import("@factor/render")
        return serveApp(opts)
      },
      NODE_ENV: opts.NODE_ENV ?? "production",
      exit: false,
      opts,
    })
  })

  commander.command("render").action(() => {
    const opts = commander.opts() as CliOptions
    return wrapCommand({
      opts,
      cb: async (opts) => {
        const { preRender } = await import("@factor/render")
        return preRender(opts)
      },
      NODE_ENV: "production",
      exit: opts.serve ? false : true,
    })
  })

  commander
    .command("release")
    .option("-pa, --patch", "patch release")
    .option("-st, --skip-tests", "skip tests")
    .action((o) => {
      const opts = { ...commander.opts(), ...o } as CliOptions

      process.env.STAGE_ENV = "prod"
      return wrapCommand({
        cb: async (opts) => {
          /**
           * @type {import("@factor/build/release")}
           */
          const { releaseRoutine } = await import("@factor/build/release")

          return releaseRoutine(opts)
        },
        opts,
        exit: true,
      })
    })

  commander
    .command("bundle")
    .description("bundle all packages")
    .option("--packageName <packageName>", "package to bundle")
    .option("--no-sourceMap", "disable sourcemap")
    .option("--NODE_ENV <NODE_ENV>", "development or production bundling")
    .option("--commit <commit>", "git commit id")
    .option("--outFile <outFile>", "name of output file")
    .action(async (o) => {
      const opts = { ...commander.opts(), ...o } as CliOptions
      const { bundleAll } = await import("@factor/build/bundle")
      await wrapCommand({ cb: (_) => bundleAll(_), opts, exit: true })
    })

  commander.parse(process.argv)
}
/**
 * Handle exit events
 * This is so we can do clean up whenever node exits (if needed)
 * https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
 */
process.stdin.resume() //so the program will not close instantly

const exitHandler = (options: {
  exit?: boolean
  shutdown?: boolean
  code?: 0 | 1
}): void | never => {
  const { exit, shutdown, code = 0 } = options
  if (shutdown) {
    emitEvent("shutdown")
  }
  if (exit) {
    done(code)
  }
}

//do something when app is closing
process.on("exit", () => exitHandler({ shutdown: true }))

//catches ctrl+c event
process.on("SIGINT", () => exitHandler({ exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", () => exitHandler({ exit: true }))
process.on("SIGUSR2", () => exitHandler({ exit: true }))

//catches uncaught exceptions
process.on("uncaughtException", (Error) => {
  logger.log({
    level: "error",
    description: "uncaught error!",
    context: "uncaughtException",
    data: Error,
  })
  done(1)
})
