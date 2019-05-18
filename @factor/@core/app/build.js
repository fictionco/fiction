module.exports = Factor => {
  return new (class {
    constructor() {
      const { resolve } = require("path")

      Factor.$paths.add({
        entry: __dirname,
        fallbacks: resolve(__dirname, "fallbacks"),
        "entry-client": resolve(__dirname, "entry-client.js"),
        "entry-server": resolve(__dirname, "entry-server.js")
      })
    }
  })()
}
