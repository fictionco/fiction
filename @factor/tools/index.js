// import * as utils from "./utils"
// import jquery from "jquery"
// import lodash from "lodash"
// import uniqId from "uniqid"
// import isNode from "detect-node"
// import validator from "validator"

// export default Factor => {

//   Factor.$guid = Factor.prototype.$guid = uniqId
//   Factor.$isNode = isNode
//   Factor.$validator = validator
//   Factor.$events = Factor.prototype.$events = new Factor()
//   Factor.$randomToken = () => randToken.generate(16)
// }

import Factor from "@factor/core"
import randToken from "rand-token"

export * from "./utils"
export * from "./utils-lodash"
export * from "./time"

export { default as isNode } from "detect-node"
export { default as guid } from "uniqid"
export { default as validator } from "validator"
export { default as DOM } from "cash-dom"

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
