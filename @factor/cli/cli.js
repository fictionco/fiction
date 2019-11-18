import { generateLoaders } from "@factor/cli/extension-loader"
import { localhostUrl } from "@factor/tools/permalink"
import * as tools from "@factor/tools"

import commander from "commander"
import inquirer from "inquirer"
import log from "@factor/tools/logger"

import { factorize, setEnvironment } from "./factorize"
import { verifyDependencies } from "./task-runner"
import pkg from "./package.json"
import { buildProductionApp } from "@factor/build/webpack-config"

// @ts-ignore
process.noDeprecation = true
// @ts-ignore
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

export async function runCommand(options = {}) {
  const {
    command,
    _arguments = {},
    filter,
    install = true,
    NODE_ENV = command == "dev" ? "development" : "production"
  } = options

  if (install) await verifyDependencies()

  await factorize({ NODE_ENV, command, filter, ..._arguments })

  try {
    if (["build", "start"].includes(command)) {
      await buildProductionApp(_arguments)
    } else if (command == "setup") {
      await tools.runCallbacks(`cli-setup`, { inquirer, ..._arguments })
    } else if (command == "run") {
      await tools.runCallbacks(`cli-run-${filter}`, { inquirer, ..._arguments })

      log.success(`Successfully ran "${filter}"\n\n`)
    }

    if (["start", "dev", "serve"].includes(command)) {
      await runServer({ NODE_ENV, ..._arguments }) // Long running process
    } else {
      if (command) log.success(`Successfully ran [${command}]`)

      exitProcess()
    }
  } catch (error) {
    log.error(error)
  }

  return
}

export function exitProcess() {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0)
}

export async function runServer(_arguments) {
  const { NODE_ENV, FACTOR_ENV, FACTOR_COMMAND, FACTOR_CWD } = process.env

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

  await tools.runCallbacks("create-server", _arguments)
}
