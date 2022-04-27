import { safeDirname } from "@factor/api"
import { FactorEnv } from "@factor/api/plugin-env"
import { FactorRelease } from "@factor/api/plugin-build/release"

const cwd = safeDirname(import.meta.url)

export const factorEnv = new FactorEnv({ cwd })

export const factorRelease = new FactorRelease({ factorEnv })
