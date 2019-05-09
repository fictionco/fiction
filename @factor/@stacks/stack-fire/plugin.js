export default Factor => {
  return new (class {
    constructor() {
      require("@factor/service-algolia").default(Factor)
      require("@factor/service-firebase-firestore").default(Factor)
      require("@factor/service-firebase-storage").default(Factor)
      require("@factor/service-firebase-functions-request").default(Factor)
      require("@factor/service-firebase-hosting").default(Factor)
      require("@factor/service-firebase-auth").default(Factor)
    }
  })()
}
