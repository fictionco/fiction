export default Factor => {
  return new class {
    constructor() {
      if (global) {
        global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
      }

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
      // Webpack can't handle the node targeted firebase-admin package
      // This allows us to use this plugin in both environments
      Factor.$filters.add("webpack-ignore-modules", _ => {
        _.push("xmlhttprequest")
        return _
      })

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
