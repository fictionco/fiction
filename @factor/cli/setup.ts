/* eslint-disable no-console */
import { getExtensions } from "@factor/cli/extension-loader"
import { getPath } from "@factor/tools/paths"
import { highlight } from "cli-highlight"
import { log, sortPriority, deepMerge, applyFilters, addCallback } from "@factor/tools"
import chalk from "chalk"
import envfile from "envfile"
import fs from "fs-extra"
import inquirer, { Answers } from "inquirer"
import json2yaml from "json2yaml"

const configFile = getPath("config-file-public")
const secretsFile = getPath("config-file-private")

addCallback("cli-setup", (_: object) => runSetup(_))

addCallback("after-first-server-extend", () => {
  const setupNeeded = applyFilters("setup-needed", [])

  if (setupNeeded.length > 0) {
    const lines = setupNeeded.map((_: { title: string }) => {
      return { title: _.title, value: "", indent: true }
    })
    if (process.env.FACTOR_COMMAND !== "setup") {
      lines.push({ title: "Run 'yarn factor setup'", value: "" })
    }

    log.formatted({ title: "Setup Needed", lines, color: "yellow" })
  }
})

export async function runSetup(cliArguments: object): Promise<void> {
  let answers: Answers

  log.formatted({
    title: "Welcome to Factor Setup!",
    lines: [
      { title: "Theme", value: extensionNames("theme"), indent: true },
      {
        title: "Modules",
        value: extensionNames("plugin", "count"),
        indent: true
      }
    ]
  })

  let setups = applyFilters(
    "cli-add-setup",
    [
      {
        name: "Exit Setup",
        value: "exit",
        callback: (): void => {
          // eslint-disable-next-line unicorn/no-process-exit
          process.exit()
        },
        priority: 1000
      }
    ],
    existingSettings()
  )

  setups = sortPriority(setups)

  // Escapes the endless loop
  const askAgain = true

  const ask = async (): Promise<void> => {
    answers = await inquirer.prompt({
      type: "list",
      name: `setupItem`,
      message: `What would you like to do?`,
      // eslint-disable-next-line no-unused-vars
      choices: setups.map((_) => {
        delete _.callback
        return _
      })
    })

    console.log()

    const setupRunner = setups.find((_) => _.value == answers.setupItem)

    await setupRunner.callback(cliArguments)

    if (askAgain) await ask()
  }

  await ask()
}

export async function writeConfig(file: string, values: object): Promise<void> {
  if (!file || !values) {
    return
  }
  const answers = await inquirer.prompt({
    type: "confirm",
    name: `writeFiles`,
    message: `Write the following settings to the "${chalk.cyan(
      file
    )}" file? \n\n ${prettyJson(values)} \n`,
    default: true
  })

  console.log()
  if (answers.writeFiles) {
    writeFiles(file, values)
    log.success(`Wrote to ${file}...\n\n`)
  } else {
    log.log(`Writing skipped.`)
  }
  console.log()

  return
}

export function prettyJson(data: object): string {
  return highlight(json2yaml.stringify(data, null, "  "))
}

function existingSettings(): { publicConfig: object; privateConfig: object } {
  if (!fs.pathExistsSync(configFile)) {
    fs.writeJsonSync(configFile, { config: {} })
  }
  const publicConfig = require(configFile)

  fs.ensureFileSync(secretsFile)
  const privateConfig = envfile.parseFileSync(secretsFile)

  return { publicConfig, privateConfig }
}

function extensionNames(type: string, format = "join"): string {
  const extensions = getExtensions().filter((_) => _.extend == type)

  if (extensions && extensions.length > 0) {
    const names = extensions.map((_) => _.name)

    return format == "count" ? names.length.toString() : names.join(", ")
  } else return "none"
}

function writeFiles(file: string, values: object): void {
  const { publicConfig, privateConfig } = existingSettings()

  if (file.includes("factor-config")) {
    const conf = deepMerge([publicConfig, values])
    fs.writeFileSync(configFile, JSON.stringify(conf, null, "  "))
  }

  if (file.includes("env")) {
    const sec = deepMerge([privateConfig, values])

    fs.writeFileSync(secretsFile, envfile.stringifySync(sec))
  }
}
