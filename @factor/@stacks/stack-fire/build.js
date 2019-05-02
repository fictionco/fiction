module.exports.default = Factor => {
  return new (class {
    constructor() {
      require("@factor/service-firebase-app-build").default(Factor)

      require("@factor/endpoint-algolia").default(Factor)

      require("@factor/service-firebase-storage").default(Factor)

      require("@factor/service-firebase-functions-build").default(Factor)

      require("@factor/service-firebase-hosting").default(Factor)

      require("@factor/service-firebase-auth").default(Factor)
    }
  })()
}
