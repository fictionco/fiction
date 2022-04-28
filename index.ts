import { safeDirname } from "@factor/api"
import { FactorEnv } from "@factor/api/plugin-env"
import { FactorRelease } from "@factor/api/plugin-build/release"
import { FactorBundle } from "@factor/api/plugin-build/bundle"
import { FactorBuild } from "@factor/api/plugin-build"

const cwd = safeDirname(import.meta.url)

export const factorEnv = new FactorEnv({ cwd })

export const factorRelease = new FactorRelease({ factorEnv })
const factorBuild = new FactorBuild({ factorEnv })
export const factorBundle = new FactorBundle({ factorEnv, factorBuild })
