import { ChildProcess } from "child_process"
import { spawn } from "cross-spawn"

export function getUrl({ route, port }: { route: string; port: string }): string {
  return `http://localhost:${port}${route}`
}

interface ProcessConfig {
  command: string;
  cwd: string;
  env?: typeof process.env;
  callback?: Function;
  options?: { env?: typeof process.env; detached?: boolean };
}

export function spawnFactorProcess({
  command,
  options,
  cwd
}: ProcessConfig): ChildProcess {
  return spawn("yarn", ["factor", command], { cwd, ...options })
}

export function startProcess({
  command,
  env,
  cwd,
  callback
}: ProcessConfig): Promise<ChildProcess> {
  return new Promise(resolve => {
    const __process = spawnFactorProcess({
      command,
      cwd,
      options: { env, detached: true }
    })

    if (!__process.stdout === null) resolve()

    process.env.FACTOR_ENV = cwd

    const listener = (data: string): void => {
      if (data.includes(`ready...`) || data.includes(`:: listening on port ::`)) {
        if (__process.stdout) __process.stdout.removeListener("data", listener)
        resolve(__process)
      }
    }

    if (typeof callback === "function") callback(__process)

    if (__process.stdout) {
      __process.stdout.on("data", listener)
    }

    if (__process.stderr) {
      __process.stderr.on("data", data =>
        data
          .toString()
          .toLowerCase()
          .includes("error")
          ? // eslint-disable-next-line no-console
            console.error(data.toString())
          : null
      )
    }
  })
}

export function closeProcess(__process: ChildProcess): Promise<void> {
  return new Promise(resolve => {
    __process.on("exit", resolve)
    process.kill(-__process.pid)
  })
}
