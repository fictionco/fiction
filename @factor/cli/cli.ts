import { buildProductionApp } from "@factor/build/webpack-config"
import { currentUrl } from "@factor/tools/url"
import { generateLoaders } from "@factor/cli/extension-loader"
import * as tools from "@factor/tools"
import commander from "commander"
import log from "@factor/tools/logger"

import { factorize, setEnvironment } from "./factorize"
import { verifyDependencies } from "./task-runner"
import { CommandOptions } from "./types"

import pkg from "./package.json"

process.noDeprecation = true
process.maxOldSpaceSize = 8192

setEnvironment()

// options added by filters, plugins or if not wanted in '--help'
commander.allowUnknownOption(true)

commander
  .version(pkg.version)
  .description("CLI for managing Factor data, builds and deployments")
  .option("--PORT <PORT>", "set server port. default: 3000")
  .option("--ENV <ENV>", "set FACTOR_ENV. default: NODE_ENV")
  .option("--restart", "restart server process flag")
  .option("--debug", "log debugging info")
  .option("--offline", "run in offline mode")

commander
  .command("dev")
  .description("Start development server")
  .option("--static", "use static file system for builds instead of memory")
  .option("--inspect", "run node debug-mode inspector")
  .action(_arguments => {
    runCommand({ command: "dev", ...cleanArguments(_arguments), NODE_ENV: "development" })
  })

commander
  .command("start")
  .description("Build and then serve production app.")
  .action(_arguments => runCommand({ command: "start", ...cleanArguments(_arguments) }))

commander
  .command("serve [NODE_ENV]")
  .description("Serve app in selected environment.")
  .action((NODE_ENV, _arguments) =>
    runCommand({
      command: "serve",
      ...cleanArguments(_arguments),
      install: false,
      NODE_ENV
    })
  )

commander
  .command("build")
  .option("--analyze", "Analyze package size")
  .option("--speed", "Output build speed data")
  .description("Build production app")
  .action(_arguments => runCommand({ command: "build", ...cleanArguments(_arguments) }))

commander
  .command("setup [filter]")
  .description("Setup and verify your Factor app")
  .action((filter, _arguments) =>
    runCommand({ command: "setup", filter, clean: false, ...cleanArguments(_arguments) })
  )

commander
  .command("run <filter>")
  .description("Run CLI utilities based on filter name (see documentation)")
  .action((filter, _arguments) =>
    runCommand({ command: "run", filter, install: false, ...cleanArguments(_arguments) })
  )

commander
  .command("create-loaders")
  .option("--clean", "clean generated directories before creation")
  .description("Generate extension loaders")
  .action(_arguments => generateLoaders(cleanArguments(_arguments)))

commander.parse(process.argv)

export async function runCommand(options: CommandOptions): Promise<void> {
  const setup = {
    install: true,
    clean: true,
    NODE_ENV: options.command == "dev" ? "development" : "production",
    ...options
  }

  const { install, filter, command } = setup

  if (install) await verifyDependencies(setup)

  await factorize(setup)

  try {
    if (command && ["build", "start"].includes(command)) {
      await buildProductionApp(setup)
    } else if (command == "setup") {
      await tools.runCallbacks(`cli-setup`, setup)
    } else if (command == "run") {
      if (!filter) throw new Error("Filter argument is required.")

      await tools.runCallbacks(`cli-run-${filter}`, setup)

      log.success(`Successfully ran "${filter}"\n\n`)
    }

    if (command && ["start", "dev", "serve"].includes(command)) {
      await runServer(setup) // Long running process
    } else {
      if (command) log.success(`Successfully ran [${command}]`)
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0)
    }
  } catch (error) {
    log.error(error)
  }

  return
}

export async function runServer(setup: CommandOptions): Promise<void> {
  const { command, inspect } = setup

  if (command && ["dev"].includes(command) && inspect) {
    await initializeNodeInspector()
  }

  const { NODE_ENV, FACTOR_ENV, FACTOR_COMMAND, FACTOR_CWD } = process.env

  const message = {
    title: "Starting Server...",
    lines: [
      { title: "URL", value: currentUrl(), indent: true },
      { title: "NODE_ENV", value: NODE_ENV, indent: true },
      { title: "FACTOR_ENV", value: FACTOR_ENV, indent: true },
      { title: "FACTOR_COMMAND", value: FACTOR_COMMAND, indent: true },
      { title: "CWD", value: FACTOR_CWD, indent: true }
    ]
  }

  log.formatted(message)

  await tools.runCallbacks("create-server", setup)
}

interface CommanderArguments {
  options: object[];
  parent: Record<string, any>;
  [key: string]: any;
}

// Clean up commanders provided arguments to just return needed CLI arguments
function cleanArguments(commanderArguments: CommanderArguments): Record<string, any> {
  const out: { [index: string]: any } = {}

  const { parent = {}, ...rest } = commanderArguments

  const flat = { ...parent, ...rest }

  // Remove all keys starting with Capital letters or underscore
  Object.keys(flat).forEach(k => {
    if (!k.startsWith("_") && !/[A-Z]/.test(k[0])) {
      out[k] = flat[k]
    }
  })

  return out
}

async function initializeNodeInspector(): Promise<void> {
  const inspector = require("inspector")
  inspector.close()
  await inspector.open()
}
