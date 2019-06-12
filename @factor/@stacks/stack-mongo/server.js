module.exports.default = Factor => {
  return new (class {
    constructor() {
      require(".").default(Factor)

      Factor.$filters.callback("endpoints", { id: "myEndpoint", handler: require("./endpoint").default(Factor) })
    }
  })()
}
