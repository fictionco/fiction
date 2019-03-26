const { ensureFileSync, writeFileSync } = require("fs-extra")
const { resolve } = require("path")

export default Factor => {
  return new class {
    constructor() {
      this.appPath = Factor.$paths.get("app")
      this.publicDir = Factor.$paths.folder("dist")

      Factor.$filters.add("initialize-build", () => {
        this.createFirebaseJson()
        this.createFirebaseRC()
      })
    }

    createFirebaseJson() {
      const fileJson = Factor.$filters.apply("firebase-config", {})

      const destinationFile = resolve(this.appPath, "firebase.json")
      ensureFileSync(destinationFile)
      writeFileSync(destinationFile, JSON.stringify(fileJson, null, 4))

      this.writeFile("firebase.json", fileJson)
    }

    createFirebaseRC() {
      const {
        development: { firebase: { projectId: devProject } = {} } = {},
        production: { firebase: { projectId: prodProject } = {} } = {}
      } = require(Factor.$paths.get("keys-public"))

      const fileJson = {
        projects: {
          production: prodProject,
          staging: devProject
        }
      }

      this.writeFile(".firebaserc", fileJson)
    }

    writeFile(name, fileJson) {
      const destinationFile = resolve(this.appPath, name)
      ensureFileSync(destinationFile)
      writeFileSync(destinationFile, JSON.stringify(fileJson, null, 4))
    }
  }()
}
