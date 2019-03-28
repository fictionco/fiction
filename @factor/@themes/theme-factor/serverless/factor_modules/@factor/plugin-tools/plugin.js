module.exports.default = Factor => {
  Factor.$jquery = Factor.prototype.$jquery = require("jquery")
  Factor.$lodash = Factor.prototype.$lodash = require("lodash")
  Factor.$http = Factor.prototype.$http = require("axios")
  Factor.$utils = Factor.prototype.$utils = require("./utils").default(Factor)

  Factor.$isNode = require("detect-node")
}
