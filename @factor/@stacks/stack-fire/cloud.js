module.exports.default = Factor => {
  return new (class {
    constructor() {
      require("@factor/service-firebase-firestore").default(Factor)
    }
  })()
}
