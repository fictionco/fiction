import { createRequire } from 'node:module'
import path from 'node:path'
import { appBuildTests } from '@factor/api/testUtils'

const require = createRequire(import.meta.url)
appBuildTests({
  cwd: path.dirname(require.resolve('@kaption/www/package.json')),
})
