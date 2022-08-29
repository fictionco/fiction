export const isNode = (): boolean => {
  return typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
    ? true
    : false
}
export const isActualBrowser = (): boolean => !isNode()
export const hasWindow = (): boolean => typeof window !== "undefined"
export const isTest = (): boolean => {
  if (typeof process == "undefined") return false
  return process.env.IS_TEST ? true : false
}
export const isApp = (): boolean => {
  if (typeof process == "undefined") return false
  return process.env.IS_VITE ? true : false
}
export const isServer = () => !isApp()

export const mode = (): "production" | "development" => {
  if (typeof process == "undefined") return "production"
  return (process.env.NODE_ENV as "production" | "development") ?? "production"
}
export const isDev = (): boolean => {
  if (typeof process == "undefined") return false
  return process.env.NODE_ENV == "development" ? true : false
}
export const isProd = () => !isDev()
export const isDebug = () => {
  if (typeof process == "undefined") return false
  return process.env.FACTOR_DEBUG ? true : false
}
export const isRestart = () => {
  if (typeof process == "undefined") return false
  return process.env.IS_RESTART ? true : false
}
export const getVersion = () => {
  if (typeof process == "undefined") return "unknown"
  return process.env.RUNTIME_VERSION || "unknown"
}
export const getCommit = () => {
  if (typeof process == "undefined") return "unknown"
  return process.env.RUNTIME_COMMIT || "unknown"
}
