const Factor = require("vue")
const admin = require(`firebase-admin`)
const functions = require("firebase-functions")
const consola = require("consola")
const { resolve } = require("path")
module.exports = FACTOR_CONFIG => {
  return new class {
    constructor() {
      this.initialize()
    }

    initialize() {
      FACTOR_CONFIG = {
        baseDir: FACTOR_CONFIG.baseDir,
        setup() {
          const { passwords } = functions.config().factor || {}

          if (passwords) {
            Factor.$filters.add("master-password", passwords)
          }

          // Add the Firebase Functions call that handles the https endpoint requests
          // This is used by the 'endpoint' class
          Factor.$filters.add("endpoint-service", () => functions.https.onRequest)
        }
      }

      this.endpointHandler = require("@factor/admin-endpoint-extend")(Factor, FACTOR_CONFIG)

      try {
        const {
          firebase: { databaseURL, serviceAccount }
        } = Factor.$config

        if (serviceAccount) {
          admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL })

          admin.firestore()
        } else {
          consola.error("Missing service account config info")
        }
      } catch (error) {
        throw new Error(error)
      }

      return Factor
    }

    endpoints() {
      // Export endpoints in the form obj['endpointname'] = endpoint(req, res)
      return this.endpointHandler.endpoints()
    }
  }()
}
