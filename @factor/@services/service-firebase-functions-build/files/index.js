const Factor = require("vue")
Factor.FACTOR_CONFIG = { baseDir: __dirname }
Factor.FACTOR_ENV = "cloud"

module.exports = require("@factor/service-firebase-functions-controller")
  .default(Factor)
  .endpoints()
