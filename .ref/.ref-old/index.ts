import {
  safeDirname,
  FactorEnv,
  FactorRelease,
  FactorBundle,
  CliOptions,
} from "@factor/api"
import { execaCommand } from "execa"
import { commands } from "./@factor/www/src/vars"
import { version } from "./package.json"
const cwd = safeDirname(import.meta.url)

export const factorEnv = new FactorEnv({
  cwd,
  appName: "FactorJS Monorepo",
  appEmail: "",
  commands,
  id: "factorRepo",
  version,
})

export const factorRelease = new FactorRelease({ factorEnv })
export const factorBundle = new FactorBundle({ factorEnv })

export const apps = ["@factor/www", "@factor/andrewpowers", "@factor/supereon"]

factorEnv.addHook({
  hook: "runCommand",
  callback: async (command: string, opts: CliOptions) => {
    if (command == "release") {
      await factorRelease.releaseRoutine(opts)
    } else if (command == "deploy") {
      await factorRelease.deployRoutine(opts)
    } else if (command == "bundle") {
      await factorBundle.bundleAll(opts)
    } else if (command == "render") {
      const apps = ["@factor/www", "@factor/andrewpowers", "@factor/supereon"]

      for (const app of apps) {
        const cmd = `npm -w ${app} exec -- factor run render`
        await new Promise((resolve) => {
          const cmdProcess = execaCommand(cmd)
          cmdProcess.stdout?.pipe(process.stdout)
          cmdProcess.stderr?.pipe(process.stderr)
          cmdProcess.stdout?.on("data", (d: Buffer) => {
            const out = d.toString()

            if (out.includes("[done:render]")) resolve(1)
          })
        })
      }
    }
  },
})
