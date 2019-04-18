module.exports = Factor => {
  return new class {
    constructor() {
      const { resolve } = require("path")

      Factor.$paths.add({
        entry: __dirname,
        "entry-client": path.resolve(__dirname, "entry-client.js"),
        "entry-server": path.resolve(__dirname, "entry-server.js")
      })
    }
  }()
}
