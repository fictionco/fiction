import { log } from "../logger"

export const isNode = (): boolean => {
  return typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
    ? true
    : false
}
export const isBrowser = (): boolean => !isNode()
export const isApp = (): boolean => {
  return process.env.IS_VITE ? true : false
}
export const isServer = () => !isApp()
export const isTest = (): boolean => {
  return process.env.TEST_ENV == "unit" ? true : false
}
export const isDev = (): boolean => {
  return process.env.NODE_ENV == "development" ? true : false
}
export const isProd = () => !isDev()

/**
 * Gets environmental variables
 * and logs warnings/errors if they are not set
 */
type VarConfig = { v: string; live?: boolean; app?: boolean }
export const getEnvVars = <T extends readonly VarConfig[]>(params: {
  vars?: T
  isApp: boolean
  isLive: boolean
}): Record<T[number]["v"], string> => {
  const env: Record<string, string> = {}
  const { vars = [], isApp, isLive } = params

  const checkVars: VarConfig[] = []

  if (isBrowser()) {
    checkVars.push(...vars.filter(({ app }) => app))
  } else {
    checkVars.push(...vars.filter(({ live }) => !live))
    if (isLive) {
      checkVars.push(...vars.filter(({ live }) => live))
    }
  }

  vars.forEach(({ v }) => {
    if (process.env[v]) {
      env[v] = process.env[v] as string
    } else if (checkVars.some((check) => check.v == v)) {
      log.warn(
        "getEnv",
        `env var: (${v}) is not set [app: ${isApp}, live: ${isLive}]`,
      )
    }
  })
  return env
}
