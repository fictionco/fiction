export { default as getPort } from "get-port"
export { default as rp } from "request-promise-native"

export const waitFor = function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || 0))
}
