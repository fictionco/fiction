import type { PackageJson } from '../types/index.js'
import type { CliVars, MainFile } from './types.js'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Command } from 'commander'
import minimist from 'minimist'
import pkg from '../package.json'
import { log } from '../plugin-log/index.js'
import { toCamel } from '../utils/casing.js'
import { emitEvent } from '../utils/event.js'
import { getMonorepoRootPath, getRequire } from '../utils/nodeUtils.js'

const commander = new Command()

const logger = log.contextLogger('CLI')

// Custom error class for CLI-specific errors
class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'CLIError'
  }
}

type ErrorCode =
  | 'SETUP_MISSING'
  | 'ENV_MISSING'
  | 'PACKAGE_LOAD_FAILED'
  | 'COMMAND_FAILED'
  | 'INSPECTOR_FAILED'

async function loadPackageJson(cwd: string): Promise<PackageJson> {
  try {
    return getRequire()(path.resolve(cwd, 'package.json')) as PackageJson
  }
  catch (error) {
    throw new CLIError(
      `Failed to load package.json: ${(error as Error).message}`,
      'PACKAGE_LOAD_FAILED',
      { cwd },
    )
  }
}

async function loadMainFile(mainFilePath: string): Promise<MainFile> {
  try {
    return await import(mainFilePath) as MainFile
  }
  catch (error) {
    throw new CLIError(
      `Failed to load main file: ${(error as Error).message}`,
      'SETUP_MISSING',
      { mainFilePath },
    )
  }
}

export async function runCommand(command: string, optionsFromCli: Record<string, unknown>) {
  const startTime = performance.now()
  let mainFilePath: string | undefined
  try {
    const cwd = process.cwd()

    const pkg = await loadPackageJson(cwd)
    const mainFileRelPath = pkg?.main ?? 'index'
    mainFilePath = path.resolve(cwd, mainFileRelPath)

    if (optionsFromCli.inspector) {
      try {
        await initializeNodeInspector()
      }
      catch (error) {
        throw new CLIError(
          `Inspector initialization failed: ${(error as Error).message}`,
          'INSPECTOR_FAILED',
        )
      }
    }

    process.env.RUNTIME_VERSION = pkg.version
    process.env.RUNTIME_COMMIT = getLatestCommitId()
    process.env.COMMAND = command
    process.env.COMMAND_OPTS = JSON.stringify(optionsFromCli || {})
    /**
     * ! THIS MUST COME AFTER ENV VARIABLES ARE SET
     *   Plugins expect the CLI vars (mode, port, etc. )
     *   At the time of initial load
     */
    const mainFileImports = await loadMainFile(mainFilePath)

    if (!mainFileImports.setup) {
      throw new Error(
        `No setup function found at [${mainFilePath}]. Can't run command ${command}`,
      )
    }

    const cliVars = process.env as CliVars

    const serviceConfig = await mainFileImports.setup()

    const fictionEnv = serviceConfig.service.fictionEnv

    if (!fictionEnv) {
      throw new CLIError(
        `No fictionEnv at [${mainFilePath}]`,
        'ENV_MISSING',
        { mainFilePath, command },
      )
    }

    // Set global service
    fictionEnv.service.value = serviceConfig.service

    // Run the command with timing
    try {
      await fictionEnv.serverRunCurrentCommand({ serviceConfig, cliVars })
      const duration = Math.round(performance.now() - startTime)
      logger.info(`Command completed successfully`, {
        command,
        duration: `${duration}ms`,
      })
    }
    catch (error) {
      throw new CLIError(
        `Command execution failed: ${(error as Error).message}`,
        'COMMAND_FAILED',
        {
          command,
          originalError: error,
        },
      )
    }
  }
  catch (error) {
    const duration = Math.round(performance.now() - startTime)
    if (error instanceof CLIError) {
      logger.error(`CLI Error: ${error.message}`, {
        code: error.code,
        details: error.details,
        duration: `${duration}ms`,
        command,
        mainFilePath,
      })
    }
    else {
      logger.error(`Unexpected error during command execution: ${(error as Error).message}`, {
        error,
        duration: `${duration}ms`,
        command,
        mainFilePath,
      })
    }
    exitHandler({ exit: true, code: 1, error: error as Error })
  }
}

export async function initializeNodeInspector(): Promise<void> {
  try {
    logger.info(`[initializing inspector]`)
    const inspector = await import(/* @vite-ignore */ 'node:inspector')
    inspector.close()
    inspector.open()
  }
  catch (error) {
    throw new CLIError(
      `Inspector initialization failed: ${(error as Error).message}`,
      'INSPECTOR_FAILED',
    )
  }
}

// Async error handler wrapper
function asyncErrorHandler(fn: (...args: any[]) => Promise<void>) {
  return async (...args: any[]) => {
    try {
      await fn(...args)
    }
    catch (error) {
      logger.error('Async operation failed', { error })
      exitHandler({ exit: true, code: 1, error: error as Error })
    }
  }
}

/**
 * Handle the CLI using Commander
 * Set up initial Node environment
 */
export const execute = asyncErrorHandler(async () => {
  commander.version(pkg.version).allowUnknownOption()

  commander
    .command('run')
    .allowUnknownOption()
    .allowExcessArguments()
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
})

function getLatestCommitId() {
  let currentPath = getMonorepoRootPath()

  if (!currentPath)
    currentPath = process.cwd()

  const buildInfoPath = path.join(currentPath, 'buildInfo.json')

  const buildInfo = fs.existsSync(buildInfoPath)

  try {
    if (buildInfo) {
      const buildInfoContent = fs.readFileSync(buildInfoPath, 'utf8')
      const { commitId } = JSON.parse(buildInfoContent)
      return `(json)${commitId.slice(-9)}`
    }
    else {
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

          const commitId = fs.readFileSync(refPath, 'utf8').trim() // Latest Commit ID

          return `(git)${commitId.slice(-9)}`
        }

        currentPath = path.dirname(currentPath) // Move up to the parent directory
      }
    }
  }
  catch (error) {
    logger.error('Error getting latest commit id', { error })
  }

  return 'notFound' // No .git folder found
}

function exitHandler(options: {
  exit?: boolean
  shutdown?: boolean
  code?: 0 | 1
  error?: Error
}): void | never {
  const { exit, shutdown, code = 0, error } = options

  // Enhanced logging for exit conditions
  const logData = {
    exit,
    shutdown,
    code,
    errorName: error?.name,
    errorMessage: error?.message,
    stack: error?.stack,
  }

  if (code === 0) {
    logger.info(`Exiting CLI`, { data: logData })
  }
  else {
    logger.error(`Exiting CLI with error`, { data: logData })
  }

  if (shutdown) {
    try {
      emitEvent('shutdown')
    }
    catch (shutdownError) {
      logger.error('Error during shutdown event', { error: shutdownError })
    }
  }

  if (exit) {
    process.exit(code)
  }
}

// Enhanced signal handling
process.on('SIGINT', () => exitHandler({ exit: true, shutdown: true }))
process.on('SIGTERM', () => exitHandler({ exit: true, shutdown: true }))
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception!', {
    error,
    name: error.name,
    message: error.message,
    stack: error.stack,
  })
  exitHandler({ exit: true, code: 1, error })
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection!', {
    reason,
    promise,
  })
  exitHandler({ exit: true, code: 1, error: reason instanceof Error ? reason : new Error(String(reason)) })
})

// IPC message handling
process.on('message', (msg) => {
  if (msg === 'shutdown')
    exitHandler({ exit: true, shutdown: true })
})
