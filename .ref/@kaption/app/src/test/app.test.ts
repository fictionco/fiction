import { safeDirname } from '@factor/api'
import { appBuildTests } from '@factor/api/testUtils'

appBuildTests({ cwd: safeDirname(import.meta.url, '../..') })
