import * as utils from "./utils"
import jquery from "jquery"
import lodash from "lodash"
import uniqId from "uniqid"
import isNode from "detect-node"
import validator from "validator"
import randToken from "rand-token"
export default Factor => {
  Factor.$jquery = Factor.prototype.$jquery = jquery
  Factor.$lodash = Factor.prototype.$lodash = lodash
  Factor.$utils = Factor.prototype.$utils = utils
  Factor.$guid = Factor.prototype.$guid = uniqId
  Factor.$isNode = isNode
  Factor.$validator = validator
  Factor.$events = Factor.prototype.$events = new Factor()
  Factor.$randomToken = () => randToken.generate(16)
}
