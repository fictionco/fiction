export default Factor => {
  return new class {
    constructor() {
      this.key = "_cypress"

      this.cypressPath = require("find-up").sync("cypress")

      if (!this.cypressPath) {
        return
      }

      this.addBuildWatchers()
    }

    testsGlob() {
      return require("path").resolve(this.cypressPath, "../", `**/${this.key}/*`)
    }

    addBuildWatchers() {
      Factor.$filters.add("development-server", () => {
        this.copyIntegrationTests()
      })
      Factor.$filters.add("dev-watchers", _ => {
        const files = [this.testsGlob()]

        const watchers = [
          {
            files,
            cb: (event, path) => {
              if (path.includes(this.key)) {
                this.copyIntegrationTests()
                //return true
              }
            }
          }
        ]

        return _.concat(watchers)
      })
    }

    copyIntegrationTests() {
      const consola = require("consola")

      const path = require("path")
      const testsDestinationFolder = path.resolve(this.cypressPath, "integration", "factor")
      const glob = require("glob").sync
      const tests = glob(this.testsGlob(), { ignore: ["**/node_modules/**", "./node_modules/**"] })
      const fs = require("fs-extra")
      fs.ensureDirSync(testsDestinationFolder)
      fs.emptyDirSync(testsDestinationFolder)

      tests.forEach(f => {
        const dest = path.resolve(testsDestinationFolder, path.basename(f))
        fs.copySync(f, dest)
      })

      consola.success("Updated Cypress Tests")
    }
  }()
}
