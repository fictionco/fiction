export default Factor => {
  return new (class {
    constructor() {
      this.client = require("firebase/app").default

      this.initialize()
    }

    initialize() {
      // Start Client Firebase Instance
      if (!this.client.apps || this.client.apps.length == 0) {
        try {
          this.client.initializeApp(Factor.$config.setting("firebase"))
          //Factor.$events.$emit("firebase-init", this.client)
        } catch (error) {
          console.error("Error initializing Firebase", error)
        }
      }

      return this.client
    }
  })()
}
