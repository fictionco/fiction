/* eslint-disable no-console */
import path from 'node:path'
import dotenv from 'dotenv'
import { execaCommand } from 'execa'

const apps = [
  'beacon',
  'widget',
  'server',
  'traffic',
  'app',
  'site',
  'session',
  'tag',
]
const r = dotenv.config({ path: path.join(process.cwd(), '/.env.prod') })

if (r.parsed) {
  const setItems = Object.entries(r.parsed).map(([key, value]) => {
    return `${key}=${value}`
  })

  apps.forEach((app) => {
    console.log('setting env vars for', app)
    console.log(setItems.join('\n'))
    const proc = execaCommand(
      `flyctl secrets set ${setItems.join(' ')} -a kaption-${app}`,
    )

    proc.stdout?.pipe(process.stdout)
    proc.stderr?.pipe(process.stderr)
  })
}
