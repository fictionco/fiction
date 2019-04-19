const { ensureFileSync, writeFileSync } = require("fs-extra")
const { resolve, dirname } = require("path")

export default Factor => {
  return new class {
    constructor() {
      this.appPath = Factor.$paths.get("app")
      this.publicDir = Factor.$paths.folder("dist")

      // Fix poorly designed Firebase packages
      // https://github.com/firebase/firebase-js-sdk/pull/1536#issuecomment-473408965
      Factor.$filters.add("webpack-aliases-server", _ => {
        const firebaseDir = dirname(require.resolve(`@firebase/app`))
        _["@firebase/app$"] = resolve(firebaseDir, "index.node.cjs.js")

        return _
      })

      // Should come before functions build
      Factor.$filters.add(
        "build-start",
        () => {
          this.createFirebaseJson()
          this.createFirebaseRC()
        },
        { priority: 40 }
      )
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
          development: devProject
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
