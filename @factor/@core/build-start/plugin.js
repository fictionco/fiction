const Factor = require("vue")
const concurrently = require("concurrently")
module.exports = async () => {
  return new class {
    constructor() {
      this.run()
    }

    async run() {
      Factor.FACTOR_TARGET = "build-start"

      require("@factor/build-extend")(Factor)

      await Factor.$filters.run(Factor.FACTOR_TARGET)

      this.runners()
    }

    async runners() {
      const buildRunners = Factor.$filters.apply("build-runners", [
        {
          command: `NODE_ENV=development node -e 'require("@factor/build-development")()' --no-warnings`,
          name: "DEV",
          prefixColor: "blue.dim"
        }
      ])

      concurrently(buildRunners, {
        prefix: "name"
      }).then(() => {
        Factor.$log.info("Factor Server Exited")
      })
    }
  }()
}
