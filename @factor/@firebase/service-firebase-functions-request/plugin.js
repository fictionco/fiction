export default Factor => {
  return new (class {
    constructor() {
      this.region = "us-central1"
      this.emulatorPort = 5001

      this.firebaseSettings = Factor.$config.setting("firebase")
      this.currentProject = this.firebaseSettings.projectId

      this.filters()
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
