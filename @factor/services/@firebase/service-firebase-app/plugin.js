export default Factor => {
  return new class {
    constructor() {
      this.client = require("firebase/app").default

      // Factor.$filters.add(
      //   "initialize-app",
      //   _ => {
      //     this.initialize()
      //   },
      //   { priority: 40 }
      // )

      this.initialize()
    }

    initialize() {
      // Start Client Firebase Instance
      if (!this.client.apps || this.client.apps.length == 0) {
        try {
          this.client.initializeApp(Factor.$config.firebase)
          Factor.$events.$emit("firebase-init", this.client)
        } catch (error) {
          console.error("Error initializing Firebase", error)
        }
      }

      return this.client
    }
  }()
}
