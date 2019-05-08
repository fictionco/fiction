export default Factor => {
  return new (class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        this.buildConfig()
      } else {
        const firebaseApp = require("@factor/service-firebase-app").default
        require("firebase/storage")

        this.client = firebaseApp(Factor).client

        Factor.$filters.add({
          provider: "firebase",
          id: "storage-service-upload",
          service: _ => this.upload(_)
        })

        Factor.$filters.add({
          provider: "firebase",
          id: "storage-service-delete",
          service: _ => this.delete(_)
        })
      }
    }

    async delete({ path }) {
      const storageServiceReference = this.client.storage().ref()

      const pathRef = storageServiceReference.child(path)

      await pathRef.delete()

      return true
    }

    upload({ path, file, change, error, done, metadata = {} }) {
      const storageServiceReference = this.client.storage().ref()

      const ref = storageServiceReference.child(path)

      const task = ref.put(file, metadata)

      console.log(`Upload to ${path}`)

      task.on(
        "state_changed",
        upload => {
          if (typeof change === "function") change(upload)
        },
        uploadError => {
          if (typeof error === "function") error(uploadError)
        },
        () => {
          if (typeof done === "function") {
            ref.getDownloadURL().then(downloadURL => {
              done(downloadURL)
            })
          }
        }
      )
    }
    buildConfig() {
      const { resolve } = require("path")
      const { copySync } = require("fs-extra")
      const fldr = Factor.$paths.folder("generated")

      copySync(resolve(__dirname, "files"), Factor.$paths.get("generated"))

      Factor.$filters.add("firebase-config", _ => {
        _.storage = {
          rules: `${fldr}/firebase-storage.rules`
        }

        return _
      })
    }
  })()
}
