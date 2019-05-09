export default Factor => {
  return new (class {
    constructor() {
      this.firebaseClientConfig = Factor.$config.setting("firebase")

      this.client = require("firebase/app").default

      this.initialize()
    }

    getClient() {
      if (!this.firebaseClientConfig) {
        return false
      } else {
        return this.client
      }
    }

    initialize() {
      const { apps } = this.client

      if (!apps || apps.length == 0) {
        try {
          this.client.initializeApp(this.firebaseClientConfig)
        } catch (error) {
          console.error("Error initializing Firebase", error)
        }
      }

      return this.client
    }
  })()
}
