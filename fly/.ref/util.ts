import path from 'node:path'
import process from 'node:process'
import type { Buffer } from 'node:buffer'
import { execaCommand } from 'execa'
import { deepMerge, log } from '@factor/api'
import dotenv from 'dotenv'
import { commands as AppCommands } from '../@kaption/app/src/vars'
import { commands as SiteCommands } from '../@kaption/www/src/vars'

class DeployUtil {
  getSecrets(secrets?: Record<string, string>) {
    const r = dotenv.config({ path: path.join(process.cwd(), '/.env.prod') })
    return deepMerge([r.parsed, secrets || {}])
  }

  getFactorServices() {
    return [
      { command: 'www', app: 'factor-www' },
      { command: 'app', app: 'factor-andrewpowers' },
      { command: 'app', app: 'factor-supereon' },
      { command: 'app', app: 'fiction-www', secrets: {} },
      { command: 'app', app: 'fiction-app', secrets: {} },
    ]
  }

  getKaptionServices() {
    const allCommands = [...AppCommands, ...SiteCommands]

    return allCommands
      .filter(c => c.type === 'service' && !c.devOnly)
      .map(c => ({
        command: c.command,
        app: `kaption-${c.command}`,
        secrets: {},
      }))
  }

  log(key: string, d: Buffer) {
    const str = d.toString()
    const type = str.toLowerCase().includes('error') ? 'error' : 'info'
    log[type](key, str)
  }

  // async deployAll() {
  //   this.getKaptionServices().map(async (command) => {
  //     const key = command.command
  //     log.info(key, "running")
  //     const proc = execaCommand(
  //       `flyctl deploy . --config ./fly/fly.${key}.toml  --build-target ${key} --remote-only --detach`,
  //     )
  //     proc.stdout?.on("data", (d: Buffer) => {
  //       this.log(key, d)
  //     })
  //     proc.stderr?.on("data", (d: Buffer) => {
  //       this.log(key, d)
  //     })

  //     return proc
  //   })
  // }

  async deploySecrets() {
    const services = [...this.getFactorServices(), ...this.getKaptionServices()]

    services.forEach((service) => {
      const secrets = this.getSecrets(service.secrets)

      if (!secrets)
        return

      const setItems = Object.entries(secrets).map(([key, value]) => {
        return `${key}=${value}`
      })

      const key = service.command
      log.info(key, 'setting env vars')
      log.info(key, setItems.join('\n'))
      const proc = execaCommand(
        `flyctl secrets set ${setItems.join(' ')} -a ${service.app}`,
      )

      proc.stdout?.on('data', (d: Buffer) => {
        this.log(key, d)
      })
      proc.stderr?.on('data', (d: Buffer) => {
        this.log(key, d)
      })
    })
  }
}

export const util = new DeployUtil()

if (process.env.DEPLOY === 'secrets')
  await util.deploySecrets()
