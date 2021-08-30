import "@factor/server"
import { emitEvent, nLog } from "@factor/server-utils"
import { CliCommand, StageId } from "@factor/types"

import { Command } from "commander"
import dotenv from "dotenv"
import path from "path"

import pkg from "./package.json"

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
  STAGE_ENV?: StageId
  NODE_ENV?: "production" | "development"
  inspect?: boolean
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
  nLog(code == 0 ? "success" : "error", `process exited (${code})`)
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

  const { NODE_ENV, STAGE_ENV } = options
  process.env.NODE_ENV = NODE_ENV || "production"
  process.env.STAGE_ENV = STAGE_ENV || StageId.Local

  const { inspect } = options
  if (inspect) {
    initializeNodeInspector()
  }
}
/**
 * For commands that use Nodemon to handle restarts
 */
const restartInitializer = (options: CommandOptions): void => {
  const nodemon = require("nodemon")

  setEnvironment(options)

  const { CMD = "dev", workspace = "" } = options

  const args = []

  if (workspace) {
    args.push(`--exec yarn workspace ${workspace} factor ${CMD}`)
  } else {
    args.push(`--exec yarn factor ${CMD}`)
  }

  nodemon(args.join(" "))

  nodemon
    .on("start", () => {})
    .on("quit", () => {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit()
    })
    .on("restart", (files: string[]) => {
      process.env.IS_RESTART = "1"
      nLog("event", "restarted due to:", { files })
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

  const { setup } = require(SERVICE)

  if (setup) {
    await setup(options)
  }

  return
}
/**
 * Run development environment
 */
export const runDev = async (options: CommandOptions): Promise<void> => {
  for (const { service } of Object.values(coreServices)) {
    const { setup } = require(service)

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
    nLog("error", "cli", error)
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
    .description("CLI for Darwin Backend")
    .option(
      "--CMD <ENV>",
      "the CLI command to run (after initializer like nodemon)",
    )
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
      cb: (_) => runService({ SERVICE: ServiceModule.Server, ..._ }),
    })
  })

  commander
    .command("dev")
    .option("--force", "force full restart and optimization")
    .action((opts) => {
      opts.mode = "development"
      return wrapCommand({
        cb: (_) => runDev(_),
        NODE_ENV: "development",
        exit: false,
        opts,
      })
    })

  commander
    .command("build")
    .option("--NODE_ENV <NODE_ENV>", "environment (development/production)")
    .option("--prerender", "prerender pages")
    .option("-s, --serve", "serve static site after build")
    .action((opts) => {
      return wrapCommand({
        cb: async (opts) => {
          await runService({ ...opts, SERVICE: ServiceModule.Server })
          return require("@factor/render").buildApp(opts)
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
    .action((opts) => {
      return wrapCommand({
        cb: async (opts) => {
          opts.prerender = true
          await runService({ ...opts, SERVICE: ServiceModule.Server })
          return require("@factor/render").buildApp(opts)
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
          return require("@factor/render").preRender(opts)
        },
        NODE_ENV: "production",
        exit: opts.serve ? false : true,
      })
    })

  commander
    .command("boot")
    .option("--workspace <workspace>", "npm/yarn workspace to run in")
    .action((opts) => restartInitializer(opts))

  commander
    .command("release")
    .description("publish a new version")
    .option("--dry", "run in dry mode")
    .option("--patch", "patch release")
    .action((opts) => {
      process.env.STAGE_ENV = StageId.Prod
      return wrapCommand({
        cb: (_) => {
          // require to prevent devDependency errors in production
          const { releaseRoutine } = require("@factor/build/release")
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
      const { bundleAll } = require("@factor/build/bundle")
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
  nLog("error", "uncaught error", Error)
  exitHandler({ exit: true, code: 1 })
})
