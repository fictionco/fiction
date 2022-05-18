import path from "path"
import { log } from "@factor/api/plugin-log"
import { requireIfExists } from "@factor/api/utils"
import type { PackageJson } from "@factor/api/types"

export const done = (code: 0 | 1, message = `exited process`): never => {
  if (message) {
    log.info("CLI", `${message} (${code})`)
  }

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(code)
}

export const packageMainFile = (cwd: string): string => {
  const pkgPath = path.resolve(cwd, "package.json")
  const pkg = requireIfExists(pkgPath) as PackageJson | undefined
  return pkg?.main ?? "index"
}
