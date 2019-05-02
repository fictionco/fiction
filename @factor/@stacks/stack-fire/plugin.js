module.exports.default = Factor => {
  return new (class {
    constructor() {
      // files["algoliaClient"] = require("@factor/service-algolia").default
      // files["firebaseapp"] = require("@factor/service-firebase-app").default
      // files["firebaseauth"] = require("@factor/service-firebase-auth").default
      // files["firebasefirestore"] = require("@factor/service-firebase-firestore").default
      // files["firebasefunctionsrequest"] = require("@factor/service-firebase-functions-request").default
      // files["firebasehosting"] = require("@factor/service-firebase-hosting").default
      // files["firebasestorage"] = require("@factor/service-firebase-storage").default
    }

    db() {
      const algolia = require("@factor/service-algolia").default(Factor)
      const firestore = require("@factor/service-firebase-firestore").default(Factor)

      let opts = { provider: "algolia" }

      Factor.$stack.register("db-service-search", _ => algolia.search(_), opts)
      Factor.$stack.register("db-service-update", _ => algolia.update(_), opts)
      Factor.$stack.register("db-service-delete", _ => algolia.delete(_), opts)

      opts.provider = "firebase"

      Factor.$stack.register("db-service-read", _ => firestore.read(_), opts)
      Factor.$stack.register("db-service-update", _ => firestore.update(_), opts)
    }

    storage() {
      const firebaseStorage = require("@factor/service-firebase-storage").default(Factor)

      const opts = { provider: "firebase" }

      Factor.$stack.register("storage-service-upload", _ => firebaseStorage.upload(_), opts)
      Factor.$stack.register("storage-service-delete", _ => firebaseStorage.delete(_), opts)
    }

    endpoints() {
      const firebaseEndpoints = require("@factor/service-firebase-functions-request").default(Factor)

      Factor.$stack.register("endpoints-base-url", () => firebaseEndpoints.endpointBaseUrl())
    }

    hosting() {}

    auth() {
      const firebaseAuth = require("@factor/service-firebase-auth").default(Factor)

      const opts = { provider: "firebase" }

      Factor.$stack.register("auth-signin", _ => firebaseAuth.credentialSignin(_), opts)
      Factor.$stack.register("auth-request-bearer-token", _ => firebaseAuth.getIdToken(_), opts)
    }
  })()
}
