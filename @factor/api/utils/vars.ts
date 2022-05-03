export const isNode = (): boolean => {
  return typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
    ? true
    : false
}
export const isActualBrowser = (): boolean => !isNode()
export const hasWindow = (): boolean => typeof window !== "undefined"
export const isApp = (): boolean => {
  return process.env.IS_VITE ? true : false
}
export const isServer = () => !isApp()
export const isTest = (): boolean => {
  return process.env.IS_TEST ? true : false
}
export const mode = (): "production" | "development" => {
  return (process.env.NODE_ENV as "production" | "development") ?? "production"
}
export const isDev = (): boolean => {
  return process.env.NODE_ENV == "development" ? true : false
}
export const isProd = () => !isDev()
export const isDebug = () => (process.env.FACTOR_DEBUG ? true : false)
export const isRestart = () => (process.env.IS_RESTART ? true : false)
