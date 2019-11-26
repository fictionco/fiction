import randToken from "rand-token"

export function randomToken() {
  return randToken.generate(16)
}

export { default as isNode } from "detect-node"
export { default as guid } from "uniqid"
export { default as validator } from "validator"
export { default as DOM } from "jquery"
