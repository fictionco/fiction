import { safeDirname } from '@fiction/core'
import { appBuildTests } from '@fiction/core/test-utils/buildTest.js'
import { commands } from '../src/commands.js'

const cwd = safeDirname(import.meta.url, '..')
await appBuildTests({ cwd, commands })
