export default Factor => {
  return new (class {
    constructor() {
      Factor.$stack.cover({
        provider: "firebase",
        id: "endpoints-base-url",
        service: () => {
          return this.endpointBaseUrl()
        }
      })
    }

    endpointBaseUrl() {
      this.region = "us-central1"
      this.emulatorPort = 5001

      const { projectId } = Factor.$config.setting("firebase") || {}

      if (projectId) {
        this.currentProject = projectId
      }

      if (Factor.$config.setting("env") == "development") {
        return `http://localhost:${this.emulatorPort}/${this.currentProject}/${this.region}`
      } else {
        return `https://${this.region}-${this.currentProject}.cloudfunctions.net`
      }
    }
  })()
}
