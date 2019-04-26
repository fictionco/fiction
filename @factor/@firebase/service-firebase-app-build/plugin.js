const { ensureFileSync, writeFileSync } = require("fs-extra")
const { resolve, dirname } = require("path")

export default Factor => {
  return new (class {
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

      Factor.$filters.add("cli-tasks", (_, args) => {
        _.push({
          command: (ctx, task) => {
            this.createFirebaseJson()
            this.createFirebaseRC()
            //task.title = `${task.title} (done)`
          },
          title: "Generating Firebase config files"
        })

        return _
      })

      // Should come before functions build
      // Factor.$filters.add("cli-firebase-app", async (_, args) => {
      //   if (args.action == "files") {
      //     _.firebaseGenerate = () => {}
      //   }

      //   return _
      // })

      Factor.$filters.add("cli-tasks-deploy-app", _ => {
        _.push({
          command: "firebase",
          args: ["deploy"],
          title: "Deploying Firebase App"
        })

        return _
      })

      Factor.$filters.add("initialize-build", () => {
        this.createBuildFirebaseInstance()
      })
    }

    createBuildFirebaseInstance() {
      const {
        firebase: { databaseURL, serviceAccount }
      } = Factor.$config.settings()

      const admin = require("firebase-admin")
      if (serviceAccount) {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL })

        admin.firestore()
      } else {
        console.warn(`Can't find your Firebase service account keys. Add to Factor configuration files.`)
      }
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
        production: { firebase: { projectId: prodProject } = {} } = {},
        all: { firebase: { projectId: allProject = "" } = {} } = {}
      } = require(Factor.$paths.get("keys-public"))

      const fileJson = {
        projects: {
          production: prodProject || allProject,
          development: devProject || allProject
        }
      }

      this.writeFile(".firebaserc", fileJson)
    }

    writeFile(name, fileJson) {
      const destinationFile = resolve(this.appPath, name)
      ensureFileSync(destinationFile)
      writeFileSync(destinationFile, JSON.stringify(fileJson, null, 4))
    }
  })()
}
