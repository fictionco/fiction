import { ChildProcess } from "child_process"
import { spawn } from "cross-spawn"

interface ProcessConfig {
  command: string
  cwd: string
  env?: typeof process.env
  callback?: Function
  options?: { env?: typeof process.env; detached?: boolean }
}
/**
 * Gets a localhost url from components
 * @param route - relative route
 * @param port - port process is using
 */
export const getUrl = ({ route, port }: { route: string; port: string }): string => {
  return `http://localhost:${port}${route}`
}

/**
 * runs a Factor command in a child process
 */
export const spawnFactorProcess = ({
  command,
  options,
  cwd,
}: ProcessConfig): ChildProcess => {
  return spawn("yarn", ["factor", command], { cwd, ...options })
}

/**
 * Starts a child process and listens to stdout
 */
export const startProcess = ({
  command,
  env,
  cwd,
  callback,
}: ProcessConfig): Promise<ChildProcess> => {
  return new Promise((resolve) => {
    const __process = spawnFactorProcess({
      command,
      cwd,
      options: { env, detached: true },
    })

    if (!__process.stdout === null) resolve()

    process.env.FACTOR_ENV = cwd

    const listener = (data: string): void => {
      if (data.includes(`Ready`)) {
        if (__process.stdout) __process.stdout.removeListener("data", listener)
        resolve(__process)
      }
    }

    if (typeof callback === "function") {
      callback(__process)
    }

    if (__process.stdout) {
      __process.stdout.on("data", listener)
    }

    if (__process.stderr) {
      __process.stderr.on("data", (data) => {
        const text = data.toString().toLowerCase()
        if (text.includes("error")) throw text
      })
    }
  })
}
/**
 * Closes and kills a child process
 */
export const closeProcess = (__process: ChildProcess): Promise<void> => {
  return new Promise((resolve) => {
    __process.on("exit", resolve)
    process.kill(-__process.pid)
  })
}
