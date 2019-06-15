module.exports.default = Factor => {
  return new (class {
    constructor() {
      require(".").default(Factor)

      const dbEndpointHandler = require("./endpoint").default(Factor)
      Factor.$filters.callback("endpoints", { id: "db", handler: dbEndpointHandler })
    }
  })()
}
