import { spawn } from "cross-spawn"
import { ChildProcess } from "child_process"
export function getUrl({ route, port }): string {
  return `http://localhost:${port}${route}`
}

export function spawnFactorProcess({ command, options, cwd }): ChildProcess {
  return spawn("yarn", ["factor", command], { cwd, ...options })
}

export function startProcess({ command, env, cwd, callback }): Promise<ChildProcess> {
  return new Promise(resolve => {
    const __process = spawnFactorProcess({
      command,
      cwd,
      options: { env, detached: true }
    })

    process.env.FACTOR_ENV = cwd

    const listener = (data): void => {
      if (data.includes(`ready...`) || data.includes(`:: listening on port ::`)) {
        __process.stdout.removeListener("data", listener)
        resolve(__process)
      }
    }

    if (typeof callback === "function") callback(__process)

    __process.stdout.on("data", listener)
    __process.stderr.on("data", data =>
      data
        .toString()
        .toLowerCase()
        .includes("error")
        ? // eslint-disable-next-line no-console
          console.error(data.toString())
        : null
    )
  })
}

export function closeProcess(__process): Promise<void> {
  return new Promise(resolve => {
    __process.on("exit", resolve)
    process.kill(-__process.pid)
  })
}
