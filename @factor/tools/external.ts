import randToken from "rand-token"
import isNode from "detect-node"
import guid from "uniqid"
import validator from "validator"
import DOM from "jquery"

export { isNode, guid, validator, DOM }
export function randomToken(): string {
  return randToken.generate(16)
}
