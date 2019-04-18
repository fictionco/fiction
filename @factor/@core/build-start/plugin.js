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

      //this.spawns()
      this.runners()
    }

    // async spawns() {
    //   const { spawn } = require("child_process")
    //   const spawnProcesses = Factor.$filters.apply("build-spawns", [])

    //   if (spawnProcesses.length > 0) {
    //     spawnProcesses.forEach(async ({ name, command, args, options }) => {
    //       const runner = spawn(command, args, { detached: true, ...options })
    //       this.showSpawnOutput(name, runner)
    //     })
    //   }

    //   return
    // }

    // showSpawnOutput(name, runner) {
    //   console.log("Starting", name)
    //   return new Promise((resolve, reject) => {
    //     runner.stdout.on("data", data => {
    //       console.log(data.toString())
    //     })
    //     runner.stderr.on("data", data => {
    //       console.log(data.toString())
    //     })
    //     runner.on("close", code => {
    //       Factor.$log.custom({
    //         type: "success",
    //         params: [`${name} [Finished - ${code}]`],
    //         target: "build-start"
    //       })
    //       resolve()
    //     })
    //   })
    // }

    async runners() {
      const buildRunners = Factor.$filters.apply("build-runners", [
        {
          command: `NODE_ENV=development node -e 'require("@factor/build-development")()' --no-deprecation`,
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
