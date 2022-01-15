import "@factor/server"
import { emitEvent, logger } from "@factor/server-utils"
import { CliCommand, StageId } from "@factor/types"

import { Command } from "commander"
import dotenv from "dotenv"
import path from "path"

import pkg from "./package.json"

import { createRequire } from "module"

const require = createRequire(import.meta.url)

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

export type CommandOptions<T = Record<string, any>> = {
  CMD?: CliCommand
  SERVICE?: ServiceModule
  STAGE_ENV?: "prod" | "dev" | "pre" | "local"
  NODE_ENV?: "production" | "development"
  inspect?: boolean
  portApp?: string
  portServer?: string
  port?: string
} & T
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
  logger({
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
  const inspector = require("inspector")
  inspector.close()
  await inspector.open()
}
/**
 * Sets Node process and environmental variables
 */
export const setEnvironment = (options: CommandOptions): void => {
  if (options.NODE_ENV == "development") {
    const devEnv = path.resolve(process.cwd(), ".dev.env")

    dotenv.config({ path: devEnv })
  }
  dotenv.config({ path: path.resolve(process.cwd(), ".env") })

  const { NODE_ENV, STAGE_ENV, port, portApp, portServer, inspect } = options

  process.env.NODE_ENV = NODE_ENV || "production"
  process.env.STAGE_ENV = STAGE_ENV || "local"

  // set up port handling
  process.env.FACTOR_APP_PORT = portApp || "3000"
  process.env.FACTOR_SERVER_PORT = portServer || "3210"

  if (port) process.env.PORT = port

  // run with node developer tools inspector
  if (inspect) initializeNodeInspector()
}

/**
 * For commands that use Nodemon to handle restarts
 */
const unitTestInitializer = async (options: CommandOptions): Promise<void> => {
  const { createVitest } = await import("vitest/node")

  runServer(options)

  const ctx = await createVitest({
    config: require.resolve("./vitest.config.ts"),
  })
  await ctx.start()
}

/**
 * For commands that use Nodemon to handle restarts
 */
const restartInitializer = (options: CommandOptions): void => {
  const nodemon = require("nodemon")

  setEnvironment(options)

  const { CMD = "rdev", workspace = "" } = options

  const configPath = require.resolve("./nodemon.json")

  const conf = require("./nodemon.json")

  const args = [`--config ${configPath}`]

  const passArgs = commander.args
  passArgs.shift()

  let script
  if (workspace) {
    script = `npm -w ${workspace} exec factor ${CMD}`
  } else {
    script = `npm exec factor ${CMD}`
  }

  script = `${script} ${passArgs.join(" ")}`

  args.push(`--exec ${script}`)
  conf.exec = script

  /**
   * The nodemon function takes either an object (that matches the nodemon config)
   * or can take a string that matches the arguments that would be used on the command line
   */
  nodemon(conf)

  nodemon
    .on("log", () => {})
    .on("start", () => {})
    .on("quit", () => {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit()
    })
    .on("restart", (files: string[]) => {
      process.env.IS_RESTART = "1"
      logger({
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
export const runService = async (options: CommandOptions): Promise<void> => {
  const { SERVICE } = options

  if (!SERVICE) {
    throw new Error(`no service argument is set (--SERVICE)`)
  }

  const { setup } = await import(SERVICE)

  if (setup) {
    await setup(options)
  }

  return
}
/**
 * Runs the endpoint server for CWD app
 */
export const runServer = async (options: CommandOptions): Promise<void> => {
  return runService({ SERVICE: ServiceModule.Server, ...options })
}
/**
 * Run development environment for CWD app
 */
export const runDev = async (options: CommandOptions): Promise<void> => {
  for (const { service } of Object.values(coreServices)) {
    const { setup } = await import(service)

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
  cb: (options: Record<string, any>) => Promise<void>
  exit?: boolean
  opts?: Record<string, string>
}): Promise<void> => {
  const { cb, exit, NODE_ENV, opts = commander.opts() } = settings
  opts.NODE_ENV = NODE_ENV

  setEnvironment(opts)

  try {
    await cb(opts)
  } catch (error) {
    logger({ level: "error", description: "cli error", data: error })
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

    .option("--STAGE_ENV <STAGE_ENV>", "how should the things be built")
    .option("--ENV <ENV>", "which general environment should be used")
    .option("--inspect", "run the node inspector")
    .option(
      "--NODE_ENV <NODE_ENV>",
      "node environment (development or production)",
    )

  commander
    .command("start")
    .option("--SERVICE <SERVICE>", "Which module to run")
    .action((opts) => {
      wrapCommand({ cb: (_) => runService(_), opts })
    })

  commander.command("server").action(() => {
    wrapCommand({
      cb: (_) => runServer(_),
    })
  })

  commander.command("test").action(async (opts) => {
    return wrapCommand({
      cb: (_) => unitTestInitializer(_),
      exit: true,
      opts,
    })
  })

  commander
    .command("dev")
    .allowUnknownOption()
    .option("-c, --CMD <ENV>", "the CLI command to run ")
    .option(
      "-w, --workspace <workspace>",
      "the workspace to run dev in (use for monorepo)",
    )
    .action((opts) => restartInitializer({ CMD: "rdev", ...opts }))

  commander
    .command("rdev")
    .option("--force", "force full restart and optimization")
    .option("-pa, --port-app <number>", "primary service port")
    .option("-ps, --port-server  <number>", "server specific port")
    .allowUnknownOption()
    .action(
      (opts: {
        portApp?: string
        portServer?: string
        mode: "development"
      }) => {
        opts.mode = "development"

        return wrapCommand({
          cb: (_) => runDev(_),
          NODE_ENV: "development",
          exit: false,
          opts,
        })
      },
    )

  commander
    .command("build")
    .option("--NODE_ENV <NODE_ENV>", "environment (development/production)")
    .option("--prerender", "prerender pages")
    .option("-s, --serve", "serve static site after build")
    .action((opts) => {
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

  commander
    .command("prerender")
    .option("--NODE_ENV <NODE_ENV>", "environment (development/production)")
    .option("-s, --serve", "serve static site after build")
    .option("-pa, --port-app <number>", "primary service port")
    .option("-ps, --port-server  <number>", "server specific port")
    .action((opts) => {
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
    return wrapCommand({
      cb: (opts) => require("@factor/render").serveApp(opts),
      NODE_ENV: "production",
      exit: false,
    })
  })

  commander
    .command("render")
    .option("-s, --serve", "serve static site after build")
    .action((opts) => {
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
    .description("publish a new version")
    .option("--patch", "patch release")
    .action((opts) => {
      process.env.STAGE_ENV = StageId.Prod
      return wrapCommand({
        cb: async (_) => {
          // require to prevent devDependency errors in production
          const { releaseRoutine } = await import("@factor/build/release")
          return releaseRoutine(_)
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
    .action(async (opts) => {
      const { bundleAll } = await import("@factor/build/bundle")
      await wrapCommand({ cb: (_) => bundleAll(_), opts, exit: true })
    })

  try {
    commander.parse(process.argv)
  } catch (error: any) {
    throw new Error(error)
  }
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
  logger({ level: "error", description: "uncaught error", data: Error })
  exitHandler({ exit: true, code: 1 })
})
