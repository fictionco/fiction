import {
  safeDirname,
  FactorEnv,
  FactorRelease,
  FactorBundle,
  FactorBuild,
} from "@factor/api"

const cwd = safeDirname(import.meta.url)

export const factorEnv = new FactorEnv({ cwd })

export const factorRelease = new FactorRelease({ factorEnv })
const factorBuild = new FactorBuild({ factorEnv })
export const factorBundle = new FactorBundle({ factorEnv, factorBuild })
