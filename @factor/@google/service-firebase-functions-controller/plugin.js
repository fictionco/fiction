const { resolve } = require("path")

module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$stack.add({
        provider: "firebase",
        id: "endpoint-service",
        service: () => require("firebase-functions").https.onRequest
      })

      Factor.$stack.add({
        provider: "firebase",
        id: "auth-token-service",
        service: () => this.authTokenHandler
      })

      Factor.$stack.add({
        provider: "firebase",
        id: "user-role-service-set",
        service: _ => this.setServiceClaims(_)
      })
      Factor.$stack.add({
        provider: "firebase",
        id: "user-role-service-get",
        service: _ => this.getServiceClaims(_)
      })

      if (Factor.FACTOR_ENV != "build") {
        this.initialize()
      }
    }

    initialize() {
      this.adminService = require("firebase-admin")

      const project = process.env.GCLOUD_PROJECT

      const RC = require(resolve(Factor.FACTOR_CONFIG.baseDir, ".firebaserc"))

      let env = "production"

      if (RC && RC.projects) {
        Object.keys(RC.projects).forEach(projectEnv => {
          if (project == RC.projects[projectEnv]) {
            if (projectEnv == "staging" || projectEnv == "development") {
              env = "development"
            }
          }
        })
      }

      // Setup items should run after initialization
      // This is a callback
      const setup = () => {
        const { decrypt } = functions.config().factor || {}

        if (decrypt) {
          Factor.$filters.add("secrets-decrypt-development", decrypt.development)
          Factor.$filters.add("secrets-decrypt-production", decrypt.production)
        }

        require("@factor/service-firebase-firestore").default(Factor)
      }

      const baseDir = FACTOR_CONFIG.baseDir

      this.endpointHandler = require("@factor/cloud-extend")(Factor, { baseDir, env, setup })

      const {
        firebase: { databaseURL, serviceAccount }
      } = Factor.$config.settings()

      if (serviceAccount) {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL })

        admin.firestore()
      } else {
        console.warn(`Can't find your Firebase service account keys. Add to Factor configuration files.`)
      }

      return Factor
    }

    async authTokenHandler(token) {
      let user = await admin.auth().verifyIdToken(token)

      // Change to camel case for consistency
      user.emailVerified = user.email_verified

      return user
    }

    async getServiceClaims({ roles, uid }) {
      const out = {}

      // Lookup the user associated with the specified uid.
      const { customClaims } = await this.adminService.auth().getUser(uid)

      if (customClaims) {
        Object.keys(roles).forEach(role => {
          if (customClaims[role]) {
            out[role] = customClaims[role]
          }
        })
      }

      return out
    }

    async setServiceClaims({ uid, claims }) {
      await this.adminService.auth().setCustomUserClaims(uid, claims)
      return claims
    }

    endpoints() {
      // Export endpoints in the form obj['endpointname'] = endpoint(req, res)
      return this.endpointHandler.endpoints()
    }
  })()
}
