import { generateLoaders } from "@factor/cli/extension-loader"
import { resolve } from "path"
import { runCallbacks, addCallback } from "@factor/tools/filters"
import commander from "commander"
import dotenv from "dotenv"
import execa from "execa"
import inquirer from "inquirer"
import listr from "listr"
import log from "@factor/tools/logger"
import { localhostUrl } from "@factor/tools/permalink"
import aliasRequire from "./alias-require"
import pkg from "./package"
import transpiler from "./transpile"

process.noDeprecation = true
process.maxOldSpaceSize = 8192

// const passedArguments = process.argv.filter(_ => _.includes("--"))

function setEnvironment({ NODE_ENV = "production", command, ENV } = {}) {
  process.env.FACTOR_CWD = process.env.FACTOR_CWD || process.cwd()
  process.env.NODE_ENV = NODE_ENV
  process.env.FACTOR_ENV = ENV || process.env.FACTOR_ENV || NODE_ENV
  process.env.FACTOR_COMMAND = command || commander._name || "none"
  process.env.FACTOR_TARGET = "server"

  dotenv.config({ path: resolve(process.env.FACTOR_CWD, ".env") })
}

setEnvironment()

// options added by filters, plugins or if not wanted in '--help'
commander.allowUnknownOption(true)

commander
  .version(pkg.version)
  .description("CLI for managing Factor data, builds and deployments")
  .option("--PORT <PORT>", "set server port. default: 3000")
  .option("--ENV <ENV>", "set FACTOR_ENV. default: NODE_ENV")
  .option("--restart", "Restart server process flag.")
  .option("--debug", "Log debugging info.")

commander
  .command("dev")
  .description("Start development server")
  .action(_arguments =>
    runCommand({ command: "dev", _arguments, NODE_ENV: "development" })
  )

commander
  .command("start")
  .description("Build and then serve production app.")
  .action(_arguments => runCommand({ command: "start", _arguments }))

commander
  .command("serve [NODE_ENV]")
  .description("Serve app in selected environment.")
  .action((NODE_ENV, _arguments) =>
    runCommand({ command: "serve", _arguments, install: false, NODE_ENV })
  )

commander
  .command("build")
  .option("--analyze", "Analyze package size")
  .option("--speed", "Output build speed data")
  .description("Build production app")
  .action(_arguments => runCommand({ command: "build", _arguments }))

commander
  .command("setup [filter]")
  .description("Setup and verify your Factor app")
  .action((filter, _arguments) => runCommand({ command: "setup", filter, _arguments }))

commander
  .command("run <filter>")
  .description("Run CLI utilities based on filter name (see documentation)")
  .action((filter, _arguments) =>
    runCommand({ command: "run", filter, install: false, _arguments })
  )

commander
  .command("create-loaders")
  .description("Generate extension loaders")
  .action(() => generateLoaders())

commander.parse(process.argv)

async function runCommand(options) {
  const {
    command,
    _arguments = {},
    filter,
    install,
    NODE_ENV = command == "dev" ? "development" : "production",
    extend = true
  } = options

  await factorize({ NODE_ENV, command, filter, install, ..._arguments, extend })

  try {
    if (["build", "start"].includes(command)) {
      await runCallbacks("create-distribution-app", _arguments)
    } else if (command == "setup") {
      await runCallbacks(`cli-setup`, { inquirer, ..._arguments })
    } else if (command == "run") {
      await runCallbacks(`cli-run-${filter}`, { inquirer, ..._arguments })

      log.success(`Successfully ran "${filter}"\n\n`)
    }

    if (["start", "dev", "serve"].includes(command)) {
      await runServer({ NODE_ENV, ..._arguments }) // Long running process
    } else {
      log.success(`Successfully ran [${command}]`)

      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0)
    }
  } catch (error) {
    log.error(error)
  }

  return
}

async function factorize(_arguments = {}) {
  const { parent = {}, ...rest } = _arguments
  const _config = { ...parent, ...rest }

  const { install = true } = _config

  setEnvironment(_config)

  if (install) {
    await runTasks(
      [
        { command: "yarn", args: ["install"], title: "Verify Dependencies" },
        {
          command: "factor",
          args: ["create-loaders"],
          title: "Verify Extensions"
        }
      ],
      { exitOnError: true }
    )
  }

  // Do this for every reset of server
  transpiler()
  aliasRequire()

  await extendServer(_config)

  // Filters must be reloaded with every new restart of server.
  // This adds the filter each time to allow for restart
  addCallback("rebuild-server-app", () => reloadNodeProcess(_config))
}

export async function extendServer({ restart = false } = {}) {
  await runCallbacks("before-server-plugins")

  // eslint-disable-next-line import/no-unresolved
  await import("~/.factor/loader-server")

  await runCallbacks("initialize-server")

  if (!restart) runCallbacks("after-first-server-extend")
}

async function runServer(_arguments) {
  const {
    NODE_ENV = process.env.NODE_ENV,
    FACTOR_ENV,
    FACTOR_COMMAND,
    FACTOR_CWD
  } = process.env

  const message = {
    title: "Starting Server...",
    lines: [
      { title: "NODE_ENV", value: NODE_ENV, indent: true },
      { title: "FACTOR_ENV", value: FACTOR_ENV, indent: true },
      { title: "FACTOR_COMMAND", value: FACTOR_COMMAND, indent: true },
      { title: "CWD", value: FACTOR_CWD, indent: true }
    ]
  }

  if (NODE_ENV == "development") {
    message.lines.unshift({ title: "URL", value: localhostUrl(), indent: true })
  }

  log.formatted(message)

  await runCallbacks("create-server", _arguments)
}

// Reloads all cached node files
// Needed for server reloading
async function reloadNodeProcess(_arguments) {
  Object.keys(require.cache).forEach(id => {
    if (/(@|\.)factor/.test(id)) delete require.cache[id]
  })

  await factorize({
    ..._arguments,
    install: false,
    restart: true,
    NODE_ENV: "development"
  })
}

async function runTasks(t, opts = {}) {
  if (t.length == 0) return

  // Don't log during tests
  if (process.env.FACTOR_ENV == "test") opts.renderer = "silent"

  const taskMap = t.map(
    ({
      title,
      command,
      args,
      options = { cwd: process.env.FACTOR_CWD, done: false, output: false }
    }) => {
      return {
        title,
        task: async (ctx, task) => {
          if (typeof command == "function") {
            return await command(ctx, task)
          } else {
            const proc = execa(command, args, options)

            if (proc) {
              proc.stdout.on("data", data => {
                task.output = data.toString()
              })

              proc.stderr.on("data", data => {
                task.output = data.toString()
              })

              try {
                await proc
              } catch (error) {
                log.error(error)
              }

              task.title = options.done ? options.done : `${task.title} [Done!]`

              return
            }
          }
        }
      }
    }
  )

  const tasks = new listr(taskMap, opts)

  await tasks.run()

  return
}
