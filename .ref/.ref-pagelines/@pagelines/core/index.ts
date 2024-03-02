import { safeDirname } from '@factor/api'

export const coreCwd = safeDirname(import.meta.url)
