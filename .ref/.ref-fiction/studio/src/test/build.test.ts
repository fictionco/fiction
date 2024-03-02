import { safeDirname } from '@factor/api'
import { appBuildTests } from '@factor/api/test-utils/buildTest'
import { commands } from '../vars'

await appBuildTests({ cwd: safeDirname(import.meta.url, '../..'), commands })
