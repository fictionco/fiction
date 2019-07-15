module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("data-schemas", () => require("./schema").default(Factor))
    }
  })()
}
