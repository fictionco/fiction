const Factor = require("vue")
module.exports = async () => {
  return new class {
    constructor() {
      this.run()
    }

    async run() {
      Factor.FACTOR_TARGET = "build-production"

      require("@factor/build-extend")(Factor)

      const { argv } = Factor.FACTOR_CONFIG

      await Factor.$filters.run(Factor.FACTOR_TARGET, {}, argv)
    }
  }()
}
