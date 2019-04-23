const Factor = require("vue")
const concurrently = require("concurrently")
module.exports = async () => {
  return new (class {
    constructor() {
      this.env = process.env.NODE_ENV || "development"
      this.run()
    }

    async run() {
      Factor.FACTOR_TARGET = "build-start"

      require("@factor/build-extend")(Factor)

      await Factor.$filters.run(Factor.FACTOR_TARGET)

      await this.spawns()

      this.runners()
    }

    async spawns() {
      const { spawn } = require("child_process")
      const spawnProcesses = Factor.$filters.apply("build-spawns", [])

      let _promises = []
      if (spawnProcesses.length > 0) {
        spawnProcesses.forEach(async ({ name, command, args, options }) => {
          const runner = spawn(command, args, { detached: true, ...options })
          _promises.push(this.showSpawnOutput(name, runner))
        })
      }

      return Promise.all(_promises)
    }

    log(name, msg) {
      Factor.$log.custom({
        type: "success",
        params: [`[${name}] ${msg}`],
        target: "build-start"
      })
    }

    showSpawnOutput(name, runner) {
      this.log(name, "Starting")
      return new Promise((resolve, reject) => {
        runner.stdout.on("data", data => {
          this.log(name, data.toString())
        })
        runner.stderr.on("data", data => {
          this.log(name, data.toString())
        })
        runner.on("close", code => {
          const status = code == 0 ? "success" : code
          this.log(name, `Finished (${code})`)
          runner.kill()
          resolve()
        })
      })
    }

    async runners() {
      let runnerCommands = []
      if (this.env == "development") {
        runnerCommands.push({
          command: `factor development`,
          name: "Development Server"
        })
      }

      const buildRunners = Factor.$filters.apply(`build-runners-${this.env}`, runnerCommands)

      runnerCommands.forEach(_ => {
        Factor.$log.info(`Running command: "${_.command}" @[${process.cwd()}]`)
      })

      try {
        await concurrently(buildRunners, {
          prefix: "name"
        })
        Factor.$log.success("Factor runners exited")
      } catch (error) {
        throw new Error(error)
      }
    }
  })()
}
