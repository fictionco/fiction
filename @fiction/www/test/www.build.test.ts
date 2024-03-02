import { appBuildTests } from '@fiction/core/test-utils/buildTest'
import { safeDirname } from '@fiction/core'
import { commands } from '../src/commands'

const cwd = safeDirname(import.meta.url, '..')
await appBuildTests({ cwd, commands })
