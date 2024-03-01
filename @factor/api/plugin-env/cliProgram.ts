import path from 'node:path'
import process from 'node:process'
import fs from 'node:fs'
import { Command } from 'commander'
import minimist from 'minimist'
import { log } from '../plugin-log'
import { toCamel } from '../utils/casing'
import { getRequire } from '../utils'
import { emitEvent } from '../utils/event'
import pkg from '../package.json'
import type { PackageJson } from '../types'
import type { CliVars, MainFile } from './types'

const commander = new Command()

const logger = log.contextLogger('CLI')

export async function runCommand(command: string, optionsFromCli: Record<string, unknown>) {
  try {
    const cwd = process.cwd()

    const pkg = getRequire()(path.resolve(cwd, 'package.json')) as PackageJson
    const mainFileRelPath = pkg?.main ?? 'index'
    const mainFilePath = path.resolve(cwd, mainFileRelPath)

    process.env.RUNTIME_VERSION = pkg.version
    process.env.RUNTIME_COMMIT = getLatestCommitId()
    process.env.COMMAND = command
    process.env.COMMAND_OPTS = JSON.stringify(optionsFromCli || {})
    /**
     * ! THIS MUST COME AFTER ENV VARIABLES ARE SET
     *   Plugins expect the CLI vars (mode, port, etc. )
     *   At the time of initial load
     */
    const mainFileImports = (await import(mainFilePath)) as MainFile

    if (!mainFileImports.setup) {
      throw new Error(
        `No setup function found at [${mainFilePath}]. Can't run command ${command}`,
      )
    }

    const cliVars = process.env as CliVars

    const serviceConfig = await mainFileImports.setup()

    const factorEnv = serviceConfig.factorEnv

    if (factorEnv)
      await factorEnv.serverRunCurrentCommand({ serviceConfig, cliVars })

    else
      logger.error(`no factorEnv at [${mainFilePath}]. Can't run command ${command}`)
  }
  catch (error) {
    log.error('CLI', `Error Running CLI Command [${command}]`, { error })
    exitHandler({ exit: true })
  }
}

export async function initializeNodeInspector(): Promise<void> {
  logger.info(`[initializing inspector]`)
  const inspector = await import(/* @vite-ignore */ 'node:inspector')
  inspector.close()
  inspector.open()
}

/**
 * Handle the CLI using Commander
 * Set up initial Node environment
 */
export async function execute(): Promise<void> {
  commander.version(pkg.version).allowUnknownOption()

  commander
    .command('run')
    .allowUnknownOption()
    .argument('<command>', 'command to run')
    .action(async (command: string) => {
      const originalCliOptions = process.argv.slice(2)
      const opts = Object.fromEntries(
        Object.entries(minimist(originalCliOptions)).map(([rawKey, val]) => {
          return [toCamel(rawKey), val] as [string, unknown]
        }),
      )
      delete opts._ // delete this added by minimist
      await runCommand(command, opts)
    })

  commander.parse(process.argv)
}

function getLatestCommitId() {
  let currentPath = process.cwd()

  for (let i = 0; i < 3; i++) { // Check current, parent, and grandparent directories
    const gitFolderPath = path.join(currentPath, '.git')

    if (fs.existsSync(gitFolderPath)) {
      const headFilePath = path.join(gitFolderPath, 'HEAD')
      if (!fs.existsSync(headFilePath))
        return 'noHead'

      const headContent = fs.readFileSync(headFilePath, 'utf8').trim()
      const refMatch = headContent.match(/ref: (.+)/)
      if (!refMatch)
        return 'noRefMatch' // Not a typical HEAD file pointing to a ref

      const refPath = path.join(gitFolderPath, refMatch[1])
      if (!fs.existsSync(refPath))
        return 'noRefPath'

      return fs.readFileSync(refPath, 'utf8').trim() // Latest Commit ID
    }

    currentPath = path.dirname(currentPath) // Move up to the parent directory
  }

  return 'notFound' // No .git folder found
}

function exitHandler(options: {
  exit?: boolean
  shutdown?: boolean
  code?: 0 | 1
}): void | never {
  const { exit, shutdown, code = 0 } = options
  if (shutdown)
    emitEvent('shutdown')

  if (exit)
    process.exit(code)
}

// Enhanced signal handling for graceful shutdown
process.on('SIGINT', () => exitHandler({ exit: true, shutdown: true }))
process.on('SIGTERM', () => exitHandler({ exit: true, shutdown: true }))
process.on('uncaughtException', (error) => {
  logger.error('Uncaught error!', { error })
  exitHandler({ exit: true, code: 1 })
})
