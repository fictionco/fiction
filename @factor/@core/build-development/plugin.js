const Factor = require("vue")
module.exports = async () => {
  return new (class {
    constructor() {
      this.run()
    }

    async run() {
      Factor.FACTOR_TARGET = "build-development"

      require("@factor/build-extend")(Factor)

      await Factor.$filters.run(Factor.FACTOR_TARGET)

      Factor.$filters.apply("create-server", { mode: "development" })
    }
  })()
}
