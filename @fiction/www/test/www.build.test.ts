import { appBuildTests } from '@factor/api/test-utils/buildTest'
import { safeDirname } from '@factor/api'
import { commands } from '../src/commands'

const cwd = safeDirname(import.meta.url, '..')
await appBuildTests({ cwd, commands })
