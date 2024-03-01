import { appBuildTests } from '@factor/api/test-utils/buildTest'
import { safeDirname } from '@factor/api'
import { commands } from '../src/vars'

await appBuildTests({
  cwd: safeDirname(import.meta.url, '..'),
  commands,
})
