import process from 'node:process'
import type { Buffer } from 'node:buffer'
import type { ServiceConfig } from '@fiction/core'
import { CliCommand, FictionBundle, FictionEnv, FictionRelease, log, safeDirname } from '@fiction/core'
import { execaCommand } from 'execa'
import { version } from './package.json'

const logger = log.contextLogger('Root Build')

const cwd = safeDirname(import.meta.url)

export const fictionEnv = new FictionEnv({
  cwd,
  id: 'fictionMonoRepo',
  commands: [
    new CliCommand({ command: 'release', type: 'util' }),
    new CliCommand({ command: 'bundle', type: 'util' }),
    new CliCommand({ command: 'render', type: 'util' }),
  ],
  version,
  meta: { app: { name: 'Fiction Monorepo', email: 'hello@fiction.com' } },
})

const fictionRelease = new FictionRelease({ fictionEnv })
const fictionBundle = new FictionBundle({ fictionEnv })

const service = { fictionEnv, fictionRelease, fictionBundle }

export function setup(): ServiceConfig {
  return {
    fictionEnv,
    runCommand: async (args) => {
      const { command, options = {} } = args

      const { mode, commit } = options

      if (command === 'release') {
        await fictionRelease.releaseRoutine(options)
      }
      else if (command === 'bundle') {
        await fictionBundle.bundleAll({ mode, commit })
      }
      else if (command === 'render') {
        const fictionApps = ['@fiction/www']

        const otherApps: string[] = []

        const apps = []
        if (options.suite === 'fiction')
          apps.push(...fictionApps)
        else
          apps.push(...fictionApps, ...otherApps)

        logger.info(`rendering ${apps.length} apps`, { data: apps })

        for (const app of apps) {
          logger.info(`rendering ${app}`)

          const cmd = `npm -w ${app} exec -- fiction run render`
          await new Promise((resolve, reject) => {
            const cp = execaCommand(cmd, { env: { FORCE_COLOR: 'true' } })
            cp.stdout?.pipe(process.stdout)
            cp.stderr?.pipe(process.stderr)
            // cp.stdout?.on('data', (d: Buffer) => {
            //   const out = d.toString()

            //   if (out.includes('[done:render]'))
            //     resolve(1)
            // })

            cp.stderr?.on('data', (d: Buffer) => {
              const out = d.toString()

              if (out.includes('error')) {
                logger.error('STDERR', { data: { out } })

                reject(out)
              }
            })

            // Listen for the 'close' event to resolve the promise
            void cp.on('close', (code) => {
              if (code === 0) {
                resolve(1)
              }
              else {
                logger.error('Subprocess exited with error code', { data: { code } })
                reject(new Error(`Subprocess exited with error code ${code}`))
              }
            }).then(() => {})

            void cp.on('error', (err) => {
              logger.error('Error executing subprocess', { data: { err } })
              reject(err)
            })
          })
        }
      }
    },
    createService: async () => service,
  }
}
