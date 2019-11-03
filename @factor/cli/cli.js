import { generateLoaders } from "@factor/cli/extension-loader"
import { localhostUrl } from "@factor/tools/permalink"
import { runCallbacks } from "@factor/tools"
import commander from "commander"
import inquirer from "inquirer"
import log from "@factor/tools/logger"

import { factorize, setEnvironment } from "./factorize"
import { verifyDependencies } from "./task-runner"
import pkg from "./package"

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
    install = true,
    NODE_ENV = command == "dev" ? "development" : "production"
  } = options

  if (install) await verifyDependencies()

  await factorize({ NODE_ENV, command, filter, ..._arguments })

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
