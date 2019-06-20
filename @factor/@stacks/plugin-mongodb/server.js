module.exports.default = Factor => {
  return new (class {
    constructor() {
      // require(".").default(Factor)
      const DB = require("./db").default(Factor)
      const handler = () => require("./endpoint").default(Factor, DB)
      Factor.$filters.callback("endpoints", { id: "db", handler })
      Factor.$stack.cover({
        id: "db-server",
        service: _ => handler().run(_)
      })
    }
  })()
}
