module.exports.default = Factor => {
  return new (class {
    constructor() {

      Factor.$filters.add("data-schemas", _ => {
        _.page = require("./schema").default(Factor)
        return _
      })
    }
  })()
}
