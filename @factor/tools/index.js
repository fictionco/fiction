// Important Developer Note
// In webpack production builds,
// any circular references to @factor/tools from modules from also included here
// Will error with "Object(...) is not a function"
// Make sure to call modules directly here

import randToken from "rand-token"

export * from "./utils"
export * from "./utils-lodash"
export * from "./time"
export * from "./filters"
export * from "./markdown"
export * from "./html"
export * from "./metatags"
export * from "./permalink"
export * from "./post-types"
export * from "./settings"
export * from "./events"
export * from "./prefetch"

export * from "@factor/app/router"
export * from "@factor/app/store"

export { default as log } from "./logger"

export { default as isNode } from "detect-node"
export { default as guid } from "uniqid"
export { default as validator } from "validator"
export { default as DOM } from "jquery"

export function randomToken() {
  return randToken.generate(16)
}
