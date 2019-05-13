module.exports = Factor => {
  return new (class {
    constructor() {
      this.addToLoaders()

      // Factor.$filters.add("verify-app", () => {
      //   const p = Factor.$stack.verifyProviders()
      //   const s = Factor.$stack.verifyServices()

      //   if (p.needed || s.needed) {
      //     const lines = []
      //     lines.push({ title: "Providers Configured", value: `${p.setup}/${p.total}` })
      //     lines.push({ title: "App Service Requests", value: `${s.setup}/${s.total}` })
      //     lines.push({ title: "To Fix", value: `Run "factor run setup" for more information`, indent: true })
      //     Factor.$log.formatted({
      //       title: "Setup Needed",
      //       lines,
      //       format: "warn"
      //     })
      //   } else {
      //     Factor.$log.formatted({
      //       title: "Services stack verified",
      //       lines: [],
      //       format: "success"
      //     })
      //   }
      // })

      Factor.$filters.add("cli-setup", (_, program) => {
        _.stack = () => require("./setup")(Factor).runSetup()
      })
    }

    addToLoaders() {
      const { stack } = Factor.FACTOR_CONFIG

      if (!stack) {
        return
      }

      this.stackPackage = stack
      const { factor: { id } = {} } = require(`${stack}/package.json`)
      Factor.$filters.add("packages-loader", (load, { target, extensions }) => {
        load.push({
          id: id || "servicesStack",
          name: this.stackPackage,
          mainFile: this.moduleMain(target),
          target: this.moduleTarget(target)
        })
        return load
      })
    }

    moduleTarget(target) {
      if (target.includes("cloud")) {
        return "cloud"
      } else if (target.includes("build")) {
        return "build"
      } else {
        return "app"
      }
    }

    moduleMain(target) {
      let mainFile
      const entries = ["cloud", "build"]

      entries.forEach(_ => {
        if (target.includes(_)) {
          const mainFileName = `${this.stackPackage}/${_}`
          const exists = require.resolve(mainFileName)

          mainFile = exists ? mainFileName : ""
        }
      })

      return mainFile
    }
  })()
}
