module.exports.default = Factor => {
  return new (class {
    constructor() {
      require("./plugin").default(Factor)
      require("./cloud").default(Factor)
      require("@factor/service-firebase-app-build").default(Factor)
      require("@factor/endpoint-algolia").default(Factor)
      require("@factor/service-firebase-functions-build").default(Factor)
      require("@factor/service-firebase-functions-controller").default(Factor)
    }
  })()
}
