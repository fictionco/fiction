/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import { getExtensions } from "@factor/cli/extension-loader"
import { getPath } from "@factor/api/paths"
import { highlight } from "cli-highlight"
import {
  log,
  sortPriority,
  deepMerge,
  applyFilters,
  addCallback,
  pushToFilter,
  slugify,
} from "@factor/api"
import chalk from "chalk"
import * as envfile from "envfile"
import fs from "fs-extra"
import inquirer, { Answers } from "inquirer"
import json2yaml from "json2yaml"
import { FactorPackageJson } from "@factor/cli/types"
import { blueChalk } from "@factor/cli/util"
export interface SetupCliConfig {
  name: string
  value: string
  callback: () => Record<string, any> | void
  priority?: number
}

const configFile = getPath("config-file-public")
const secretsFile = getPath("config-file-private")

/**
 * Batch notices during CLI initialization
 * If they've already been logged, then just log them
 */
let __noticesLogged = false
/**
 * Add a CLI notice
 * This allows for a consistent and 'all at once' output
 */
export const addNotice = (text: string): void => {
  if (__noticesLogged) {
    log.warn(text)
  } else {
    pushToFilter({
      key: slugify(text.slice(1, 30)) ?? "",
      hook: "cli-notices",
      item: text,
    })
  }
}

/**
 * Log the notices that have been added
 */
export const logNotices = (): void => {
  const notices = applyFilters("cli-notices", [])
  if (notices.length > 0) {
    log.log()
    notices.forEach((_: string) => {
      log.info(typeof _ == "string" ? chalk.bold(_) : _)
    })
    log.log()
  }
  __noticesLogged = true
}

/**
 * Gets the names of a specific type of extension
 * @param type - type of extension
 * @param format - the format to return
 */
const extensionNames = (type: "plugin" | "theme" | "app", format = "join"): string => {
  const extensions = getExtensions().filter((_) => _.extend == type)

  if (extensions && extensions.length > 0) {
    const names = extensions.map((_) => _.name)

    return format == "count" ? names.length.toString() : names.join(", ")
  } else return "none"
}

/**
 * Gets existing configuration settings
 * Also returns packageJson for writing later
 */
const existingSettings = (): {
  packageJson: FactorPackageJson
  publicConfig: Record<string, any>
  privateConfig: Record<string, any>
} => {
  const packageJson = require(configFile)
  const { factor: publicConfig = {} } = packageJson

  fs.ensureFileSync(secretsFile)
  const privateConfig = envfile.parse(secretsFile)

  return { publicConfig, privateConfig, packageJson }
}

/**
 * Runs the CLI setup utility
 */
export const runSetup = async (): Promise<void> => {
  let answers: Answers

  log.formatted({
    title: "Welcome to Factor Setup!",
    lines: [
      { title: "Theme", value: extensionNames("theme"), indent: true },
      {
        title: "Modules",
        value: extensionNames("plugin", "count"),
        indent: true,
      },
    ],
  })

  let setups: SetupCliConfig[] = applyFilters(
    "cli-add-setup",
    [
      {
        name: "Exit Setup",
        value: "exit",
        callback: (): void => {
          // eslint-disable-next-line unicorn/no-process-exit
          process.exit()
        },
        priority: 1000,
      },
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
      choices: setups,
    })

    console.log()

    const setupRunner = setups.find((_: SetupCliConfig) => _.value == answers.setupItem)

    if (setupRunner) {
      await setupRunner.callback()
    }

    if (askAgain) await ask()
  }

  await ask()
}

/**
 * Reports to the user which configuration is missing
 */
export const logSetupNeeded = (command = ""): void => {
  const setupNeeded = applyFilters("setup-needed", [])

  if (setupNeeded.length > 0) {
    const lines = setupNeeded.map((_: { title: string; value: string }) => {
      return { title: _.title, value: _.value, indent: true }
    })

    log.formatted({ title: "Setup Needed", lines })
  }

  log.diagnostic({ event: "factorCommand", action: `${command}-${setupNeeded.length}` })
}

addCallback({ key: "notices", hook: "dev-server-built", callback: () => logNotices() })

/**
 * Hook into the CLI command filter
 */
addCallback({ key: "setup", hook: "cli-setup", callback: () => runSetup() })

/**
 * Output JSON nicely to the CLI
 * @param data - data to output
 */
export const prettyJson = (data: Record<string, any>): string => {
  return highlight(json2yaml.stringify(data, null, "  "))
}

/**
 * Writes configuration to the private or public config files
 * @param file - private or public config
 * @param values - object map of values
 */
export const writeFiles = (
  file: "public" | "private" | "package",
  values: Record<string, any>,
  callback?: (p: FactorPackageJson) => FactorPackageJson
): void => {
  const { publicConfig, privateConfig } = existingSettings()
  let { packageJson } = existingSettings()
  if (file == "public" || file == "package") {
    if (file == "public") {
      packageJson.factor = deepMerge([publicConfig, values])
    } else {
      packageJson = deepMerge([packageJson, values]) as FactorPackageJson
    }

    // Allow for additional work via callback (remove fields)
    if (callback) {
      packageJson = callback(packageJson)
    }

    fs.writeFileSync(configFile, JSON.stringify(packageJson, null, "  "))

    // In case the built file is used later in process
    delete require.cache[configFile]
  }

  if (file == "private") {
    const sec = deepMerge([privateConfig, values])

    fs.writeFileSync(secretsFile, envfile.stringify(sec))

    // In case the built file is used later in process
    delete require.cache[secretsFile]
  }
}

/**
 * Display to the user the values that will be written and confirm with them
 * @param file - private or public config
 * @param values - object map of values
 */
export const writeConfig = async (
  file: "public" | "private",
  values: Record<string, any>
): Promise<void> => {
  if (!file || !values) {
    return
  }

  const fileName = file == "public" ? "package.json" : ".env"
  const outFile = blueChalk(fileName)
  const answers = await inquirer.prompt({
    type: "confirm",
    name: `writeFiles`,
    message: `Write the following ${file} config to the ${outFile} file? \n\n ${prettyJson(
      values
    )} \n`,
    default: true,
  })

  console.log()
  if (answers.writeFiles) {
    writeFiles(file, values)
    log.success(`Wrote to ${fileName}...\n\n`)
  } else {
    log.log(`Writing skipped.`)
  }
  console.log()

  return
}
