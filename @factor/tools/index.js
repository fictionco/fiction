import Factor from "@factor/core"
import randToken from "rand-token"

export * from "./utils"
export * from "./utils-lodash"
export * from "./time"
export * from "./filters"
export * from "./settings"
export * from "./store-router"
export * from "./markdown"
export * from "./html"
export { default as log } from "./logger"

export * from "@factor/tools/paths" // @factor = allow overrides

export { default as isNode } from "detect-node"
export { default as guid } from "uniqid"
export { default as validator } from "validator"
export { default as DOM } from "jquery"

export const events = new Factor()

export function emitEvent(event, data) {
  events.$emit(event, data)
}

export function onEvent(event, callback) {
  events.$on(event, callback)
}

export function randomToken() {
  return randToken.generate(16)
}
