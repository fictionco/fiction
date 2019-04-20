const Factor = require("vue")
const admin = require("firebase-admin")
const functions = require("firebase-functions")

const { resolve } = require("path")
module.exports = FACTOR_CONFIG => {
  return new (class {
    constructor() {
      this.initialize()
    }

    initialize() {
      this.adminService = admin

      const that = this

      const project = process.env.GCLOUD_PROJECT

      const RC = require(resolve(FACTOR_CONFIG.baseDir, ".firebaserc"))

      let staging = false

      if (RC && RC.projects) {
        Object.keys(RC.projects).forEach(projectEnv => {
          if (project == RC.projects[projectEnv]) {
            if (projectEnv == "staging" || projectEnv == "development") {
              staging = true
            }
          }
        })
      }

      // Setup items should run after initialization
      // This is a callback
      const setup = () => {
        const { passwords } = functions.config().factor || {}

        if (passwords) {
          Factor.$filters.add("master-password", passwords)
        }

        // Add the Firebase Functions call that handles the https endpoint requests
        // This is used by the 'endpoint' class
        Factor.$filters.add("endpoint-service", () => functions.https.onRequest)

        Factor.$filters.add("auth-token-service", () => that.authTokenHandler)

        Factor.$filters.add("user-role-service-set", _ => that.setServiceClaims(_))
        Factor.$filters.add("user-role-service-get", _ => that.getServiceClaims(_))

        require("@factor/service-firebase-firestore").default(Factor)
      }

      FACTOR_CONFIG = {
        baseDir: FACTOR_CONFIG.baseDir,
        staging,
        setup
      }

      this.endpointHandler = require("@factor/serverless-extend")(Factor, FACTOR_CONFIG)

      const {
        firebase: { databaseURL, serviceAccount }
      } = Factor.$config.settings()

      if (serviceAccount) {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL })

        admin.firestore()
      } else {
        Factor.$log.warn("Missing service account config info")
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
