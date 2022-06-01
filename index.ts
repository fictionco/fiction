import {
  safeDirname,
  FactorEnv,
  FactorRelease,
  FactorBundle,
  FactorBuild,
  CliOptions,
} from "@factor/api"

const cwd = safeDirname(import.meta.url)

export const factorEnv = new FactorEnv({
  cwd,
  appName: "FactorJS Monorepo",
  appEmail: "",
})

export const factorRelease = new FactorRelease({ factorEnv })
export const factorBundle = new FactorBundle()

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
