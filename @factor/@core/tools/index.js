export default Factor => {
  Factor.$jquery = Factor.prototype.$jquery = require("jquery")
  Factor.$lodash = Factor.prototype.$lodash = require("lodash")
  Factor.$utils = Factor.prototype.$utils = require("./utils").default(Factor)
  Factor.$guid = Factor.prototype.$guid = require("uniqid")
  Factor.$isNode = require("detect-node")
  Factor.$validator = require("validator")
  Factor.$events = Factor.prototype.$events = new Factor()
  Factor.$randomToken = () => require("rand-token").generate(16)
}
