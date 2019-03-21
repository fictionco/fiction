export default Factor => {
  return new class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        this.addConfig()
      } else {
        const firebaseApp = require("@factor/service-firebase-app").default
        require("firebase/storage")

        this.client = firebaseApp(Factor).client
      }
    }

    addConfig() {
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
  }()
}
