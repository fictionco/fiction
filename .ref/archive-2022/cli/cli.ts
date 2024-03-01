import path from 'node:path'
import { createRequire } from 'node:module'
import type { OptionValues } from 'commander'
import { Command } from 'commander'
import dotenv from 'dotenv'
import { emitEvent } from '@factor/api/event'
import { setupServerEnv } from '@factor/server'
import factorServerConfig from '@kaption/app/factor.config'
import { logger } from '@factor/api'
import pkg from './package.json'

const require = createRequire(import.meta.url)

const commander = new Command()

enum ServiceModule {
  Replay = '@kaption/replay',
  Manager = '@kaption/manager',
  Ingest = '@kaption/ingest',
  Tracking = '@kaption/tracking',
  Engine = '@kaption/engine',
  Proxy = '@kaption/proxy',
}

enum NodeEnv {
  Development = 'development',
  Production = 'production',
}

enum CliCommand {
  Start = 'start',
  Dev = 'dev',
  Boot = 'boot',
}

interface EntryFile { setup: () => Promise<void> }

export type CommandOptions<T = Record<string, any>> = {
  CMD?: CliCommand
  SERVICE?: ServiceModule
  STAGE_ENV?: 'prod' | 'pre' | 'local'
  NODE_ENV?: 'production' | 'development'
  inspect?: boolean
} & T
/**
 * Is current start a nodemon restart
 */
export function isRestart(): boolean {
  return process.env.IS_RESTART === '1'
}
/**
 * CLI is done, exit process
 */
export function done(code: 0 | 1): never {
  logger.log({
    level: code === 0 ? 'info' : 'error',
    context: 'CLI',
    description: `process exited (${code})`,
  })

  process.exit(code)
}
/**
 * Opens the node inspector port
 * https://nodejs.org/api/inspector.html
 */
async function initializeNodeInspector(): Promise<void> {
  const inspector = await import('node:inspector')
  inspector.close()
  inspector.open()
}
/**
 * Sets Node process and environmental variables
 * @param _arguments - cli options
 */
export async function setEnvironment(options: CommandOptions): Promise<void> {
  const dirname = new URL('.', import.meta.url).pathname
  dotenv.config({ path: path.resolve(dirname, './.env') })

  await setupServerEnv(factorServerConfig)

  if (options.NODE_ENV === 'development') {
    initializeNodeInspector().catch((error: unknown) => {
      logger.log({
        level: 'info',
        context: 'cli',
        description: 'node inspector error',
        data: { error },
      })
    })
  }
}
/**
 * For commands that use Nodemon to handle restarts
 */
async function restartInitializer(options: CommandOptions): Promise<void> {
  const { default: nodemon } = await import('nodemon')
  await setEnvironment(options)

  const conf = require('./nodemon.json') as Record<string, any>

  const passArgs = commander.args
  passArgs.shift()

  const script = `npm exec -- kaption rdev ${passArgs.join(' ')}`

  conf.exec = script

  /**
   * The nodemon function takes either an object (that matches the nodemon config)
   * or can take a string that matches the arguments that would be used on the command line
   */
  nodemon(conf)

  nodemon
    .on('log', () => {})
    .on('start', () => {})
    .on('quit', () => done(0))
    .on('restart', (files: string[]) => {
      process.env.IS_RESTART = '1'

      logger.log({
        level: 'info',
        context: 'nodemon',
        description: 'restarted due to:',
        data: { files },
      })
    })
}
/**
 * Runs a command entered in the CLI
 * @param options - command options
 */
export async function runService(options: CommandOptions): Promise<void> {
  const { SERVICE } = options

  if (!SERVICE)
    throw new Error(`no service argument is set (--SERVICE)`)

  const { setup } = (await import(SERVICE)) as EntryFile

  if (setup)
    await setup()
}
/**
 * Run development environment
 */
export async function runDev(options: CommandOptions<{ open?: boolean }>): Promise<void> {
  const { NODE_ENV, STAGE_ENV } = options
  process.env.NODE_ENV = NODE_ENV || NodeEnv.Development
  process.env.STAGE_ENV = STAGE_ENV || 'local'

  const services = [
    ServiceModule.Replay,
    ServiceModule.Manager,
    ServiceModule.Ingest,
    ServiceModule.Tracking,
    ServiceModule.Engine,
    ServiceModule.Proxy,
  ]

  // require to prevent devDependency errors in production
  const { runDevelopment } = await import('@kaption/build/dev')

  const _promises = [
    runDevelopment(options),
    ...services.map(async (SERVICE) => {
      const { setup } = (await import(SERVICE)) as EntryFile

      if (setup)
        await setup()
    }),
  ]

  await Promise.all(_promises)
}
/**
 * Standard wrap for a CLI command that exits and sanitizes input args
 */
async function wrapCommand(settings: {
  NODE_ENV?: NodeEnv
  cb: (options: Record<string, any>) => Promise<void>
  exit?: boolean
  opts?: OptionValues
}): Promise<void> {
  const { cb, exit, NODE_ENV, opts = commander.opts() } = settings
  opts.NODE_ENV = (opts.NODE_ENV || NODE_ENV) as NodeEnv | undefined
  await setEnvironment(opts)

  try {
    await cb(opts)
  }
  catch (error) {
    logger.log({
      level: 'error',
      context: 'cli',
      description: 'cli wrap command',
      data: error,
    })
    done(1)
  }
  if (exit)
    done(0)
}
/**
 * Handle the CLI using Commander
 * Set up initial Node environment
 */
export function execute(): void {
  commander
    .version(pkg.version)
    .description('CLI for Backend')
    .option(
      '--CMD <ENV>',
      'the CLI command to run (after initializer like nodemon)',
    )
    .option('--STAGE_ENV <STAGE_ENV>', 'how should the things be built')
    .option('--ENV <ENV>', 'which general environment should be used')
    .option('--inspector', 'run the node inspector')

  commander
    .command('start')
    .description('start a specific node service')
    .option('--SERVICE <SERVICE>', 'Which module to run')
    .action((opts: OptionValues) => {
      return wrapCommand({ cb: _ => runService(_), opts })
    })

  commander
    .command('rdev')
    .option('--open', 'open testing page')
    .action((opts: OptionValues) => {
      return wrapCommand({ cb: _ => runDev(_), opts, exit: false })
    })

  commander
    .command('dev')
    .action((opts: OptionValues) => restartInitializer(opts))

  try {
    commander.parse(process.argv)
  }
  catch (error: unknown) {
    logger.log({
      level: 'error',
      context: 'CLI',
      description: 'commander parse',
      data: { error },
    })
  }
}
/**
 * Handle exit events
 * This is so we can do clean up whenever node exits (if needed)
 * https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
 */
process.stdin.resume() // so the program will not close instantly

function exitHandler(options: {
  exit?: boolean
  shutdown?: boolean
  code?: 0 | 1
}): void | never {
  const { exit, shutdown, code = 0 } = options
  if (shutdown)
    emitEvent('shutdown')

  if (exit)
    done(code)
}

// do something when app is closing
process.on('exit', () => exitHandler({ shutdown: true }))

// catches ctrl+c event
process.on('SIGINT', () => exitHandler({ exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', () => exitHandler({ exit: true }))
process.on('SIGUSR2', () => exitHandler({ exit: true }))

// catches uncaught exceptions
process.on('uncaughtException', (Error, origin) => {
  logger.log({
    level: 'error',
    context: 'CLI',
    description: 'CLI uncaught error',
    data: { Error, origin },
  })

  exitHandler({ exit: true, code: 1 })
})
