import process from 'node:process'
import type { Buffer } from 'node:buffer'
import type { ServiceConfig } from '@fiction/core'
import { CliCommand, FictionBundle, FictionEnv, FictionRelease, log, safeDirname } from '@fiction/core'
import { execaCommand } from 'execa'
import { version } from './package.json'

const cwd = safeDirname(import.meta.url)

export const fictionEnv = new FictionEnv({
  cwd,
  appEmail: 'hello@supereon.ai',
  appName: 'Supereon Monorepo',
  id: 'supereonRepo',
  commands: [
    new CliCommand({ command: 'release', type: 'util' }),
    new CliCommand({ command: 'bundle', type: 'util' }),
    new CliCommand({ command: 'render', type: 'util' }),
  ],
  version,
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

        const pageLinesApps: string[] = []

        const otherApps = ['@fiction/andrewpowers']

        const apps = []
        if (options.suite === 'fiction')
          apps.push(...fictionApps)
        else if (options.suite === 'pagelines')
          apps.push(...otherApps, ...pageLinesApps)
        else
          apps.push(...fictionApps, ...pageLinesApps, ...otherApps)

        log.info('render', `rendering ${apps.length} apps`, { data: apps })

        for (const app of apps) {
          log.info('render', `rendering ${app}`)

          const cmd = `npm -w ${app} exec -- fiction run render`
          await new Promise((resolve) => {
            const cp = execaCommand(cmd, { env: { FORCE_COLOR: 'true' } })
            cp.stdout?.pipe(process.stdout)
            cp.stderr?.pipe(process.stderr)
            cp.stdout?.on('data', (d: Buffer) => {
              const out = d.toString()

              if (out.includes('[done:render]'))
                resolve(1)
            })
          })
        }
      }
    },
    createService: async () => service,
  }
}
