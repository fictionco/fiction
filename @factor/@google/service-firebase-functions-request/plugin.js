export default Factor => {
  return new (class {
    constructor() {
      Factor.$stack.registerCredentials({
        scope: "public",
        title: "Firebase Project ID",
        description: `The ID for the active Firebase project`,
        provider: "firebase",
        keys: ["projectId"]
      })

      this.region = "us-central1"
      this.emulatorPort = 5001

      const { projectId } = Factor.$config.setting("firebase") || {}

      if (projectId) {
        this.currentProject = projectId

        this.filters()
      }
    }

    filters() {
      Factor.$filters.add("endpoints-base-url", () => {
        return this.endpointBaseUrl()
      })
    }

    endpointBaseUrl() {
      if (Factor.$config.setting("env") == "development") {
        return `http://localhost:${this.emulatorPort}/${this.currentProject}/${this.region}`
      } else {
        return `https://${this.region}-${this.currentProject}.cloudfunctions.net`
      }
    }
  })()
}
