export default Factor => {
  return new class {
    constructor() {
      if (!Factor.$isNode) {
        this.setKeys()
        this.listeners()
      }
    }

    setKeys() {
      const { google: { apiKey = "", clientId = "" } = {} } = Factor.$config

      if (!apiKey || !clientId) {
        const f = []
        if (!apiKey) {
          f.push("apiKey")
        }
        if (!clientId) {
          f.push("clientId")
        }
        console.log(`[Factor Config] Missing ${f.join(", ")} for Google API Plugin`)
      }

      this.apiKey = apiKey
      this.clientId = clientId
    }

    listeners() {
      Factor.$filters.add("auth-provider-tokens", ({ provider }) => {
        if (provider.includes("google")) {
          return this.getToken()
        }
      })

      Factor.$events.$on("logout", () => {
        this.logout()
      })
    }

    loadClientApi() {
      return new Promise(resolve => {
        if (this.gapi) {
          resolve(this.gapi)
        } else {
          require("scriptjs")("https://apis.google.com/js/api.js", () => {
            this.gapi = window.gapi
            this.gapi.load("client:auth2", {
              callback: async () => {
                await this.gapi.client.init({
                  apiKey: this.apiKey,
                  clientId: this.clientId,
                  scope: "profile",
                  discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"]
                })

                resolve(this.gapi)
              },
              onerror: () => {
                reject("gapi.client failed to load!")
              },
              timeout: 2000,
              ontimeout: () => {
                reject("gapi.client could not load in a timely manner!")
              }
            })
          })
        }
      })
    }
    async getToken() {
      const googleAuth = await this.login()
      const idToken = googleAuth.Zi.id_token
      const accessToken = googleAuth.Zi.access_token

      return { idToken, accessToken }
    }

    async login() {
      await this.loadClientApi()
      // Ideally the button should only show up after gapi.client.init finishes, so that this
      // handler won't be called before OAuth is initialized.
      const result = await this.gapi.auth2.getAuthInstance().signIn()

      return result
    }

    async loggedIn() {
      await this.loadClientApi()
      return this.gapi.auth2.getAuthInstance().isSignedIn.get()
    }

    async logout() {
      await this.loadClientApi()
      if (this.loggedIn()) {
        this.gapi.auth2.getAuthInstance().signOut()
      }
    }
  }()
}
