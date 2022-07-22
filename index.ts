import {
  safeDirname,
  FactorEnv,
  FactorRelease,
  FactorBundle,
  CliOptions,
} from "@factor/api"
import { commands } from "./@factor/www/src/vars"
const cwd = safeDirname(import.meta.url)

export const factorEnv = new FactorEnv({
  cwd,
  appName: "FactorJS Monorepo",
  appEmail: "",
  commands,
  id: "root",
})

export const factorRelease = new FactorRelease({ factorEnv })
export const factorBundle = new FactorBundle({ factorEnv })

factorEnv.addHook({
  hook: "runCommand",
  callback: async (command: string, opts: CliOptions) => {
    if (command == "release") {
      await factorRelease.releaseRoutine(opts)
    } else if (command == "deploy") {
      await factorRelease.deployRoutine(opts)
    } else if (command == "bundle") {
      await factorBundle.bundleAll(opts)
    }
  },
})
