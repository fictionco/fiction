export default Factor => {
  return new (class {
    constructor() {
      Factor.$stack.register({
        title: "Google Auth Provider Tokens",
        id: "auth-provider-tokens-google",
        returns: "Object { idToken, accessToken }"
      })

      Factor.$stack.cover({
        provider: "firebase",
        id: "auth-signin",
        description: "Logs in a user with Firebase",
        service: _ => this.credentialSignin(_)
      })

      Factor.$stack.cover({
        provider: "firebase",
        id: "auth-request-bearer-token",
        description: "Returns firebase user id token.",
        service: _ => this.getIdToken()
      })

      const firebaseApp = require("@factor/service-firebase-app").default

      require("firebase/auth")

      this.client = firebaseApp(Factor).getClient()

      if (this.client) {
        Factor.$filters.add("after-initialize-app", () => {
          this.events()
        })
      }
    }

    async getTokens({ provider }) {
      return await Factor.$stack.service(`auth-provider-tokens-${provider}`)
    }

    error(error) {
      Factor.$log.error("[Firebase Auth]", error)
    }

    onAuthStateChanged(callback) {
      return this.client.auth().onAuthStateChanged(callback)
    }

    events() {
      Factor.$events.$on("auth-refresh-tokens", () => this.refreshUserAuthTokens())
      Factor.$events.$on("auth-remove", () => {
        this.signOut()
      })

      this.onAuthStateChanged(serviceUser => {
        const uid = serviceUser ? serviceUser.uid : null

        Factor.$events.$emit("auth-state-changed", { uid })
      })
    }

    async refreshUserAuthTokens() {
      await this.client.auth().currentUser.getIdToken(true)
    }

    async linkProvider(args) {
      const { provider } = args
      if (provider.includes("email")) {
        await this.sendEmailVerification()
      } else {
        const credential = await this.getProviderCredential(args)

        await this.client.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
      }

      return
    }

    async getIdToken() {
      if (this.client.auth().currentUser) {
        return await this.client.auth().currentUser.getIdToken()
      } else {
        return false
      }
    }

    async credentialSignin(args) {
      const credential = await this.getProviderCredential(args)

      const firebaseUserCredential = await this.client.auth().signInAndRetrieveDataWithCredential(credential)

      return this.firebaseToFactorCredential(firebaseUserCredential)
    }

    async getProviderCredential(args) {
      const { provider = "" } = args
      const tokens = await this.getTokens({ provider })
      //const tokens = await Factor.$filters.apply("auth-provider-tokens", args)
      console.log("auth token", tokens)
      const { idToken, accessToken } = tokens

      let credential
      if (provider.includes("facebook")) {
        credential = this.client.auth.FacebookAuthProvider.credential(accessToken)
      } else if (provider.includes("google")) {
        credential = this.client.auth.GoogleAuthProvider.credential(idToken, accessToken)
      }

      return credential
    }

    async getUserPrivs(firebaseUser) {
      const tokenResult = await firebaseUser.getIdTokenResult(true)

      const roles = []

      let accessLevel = 0

      if (tokenResult && tokenResult.claims) {
        const userRoles = Factor.$user.config().roles
        const { claims } = tokenResult
        Object.keys(userRoles).forEach(role => {
          if (claims[role]) {
            roles.push(role)
            //  privs[role] = claims[role]
          }
        })

        accessLevel = claims.accessLevel || 0
      }

      return { roles, accessLevel }
    }

    async firebaseToFactorCredential(firebaseUserCredential) {
      const {
        additionalUserInfo: { isNewUser },
        credential,
        user
      } = firebaseUserCredential

      const factorUser = await this.firebaseToFactorUser(user)
      return {
        auth: {
          isNewUser,
          ...credential
        },
        user: factorUser
      }
    }

    async firebaseToFactorUser(firebaseUser) {
      const basicFields = ["uid", "photoURL", "displayName", "email", "emailVerified"]

      let clean = {}

      basicFields.forEach(index => {
        if (typeof firebaseUser[index] != "undefined") {
          clean[index] = firebaseUser[index]
        }
      })

      // Get user priviledges via custom claims
      const { roles, accessLevel } = await this.getUserPrivs(firebaseUser)

      clean.roles = roles
      clean.accessLevel = accessLevel
      // Public serviceId information
      clean.serviceId = firebaseUser.serviceId || {}

      // Firebase user object refinement
      if (firebaseUser.metadata) {
        clean.createdAt = Factor.$time.stamp(firebaseUser.metadata.creationTime)
        clean.signedInAt = Factor.$time.stamp(firebaseUser.metadata.lastSignInTime)
      }

      // Private Auth Information (current user)
      clean.auths = firebaseUser.auths || {}

      if (firebaseUser.providerData) {
        firebaseUser.providerData.forEach((prov, key) => {
          const provider = JSON.parse(JSON.stringify(prov))
          clean.auths[key] = provider // Ways to authenticate
          clean.serviceId[key] = provider.uid || true // Attached Services
        })
      }

      if (firebaseUser.emailVerified) {
        clean.serviceId.email = firebaseUser.email
      }

      return clean
    }

    async unlinkProvider(provider) {
      return await this.client.auth().currentUser.unlink(provider)
    }

    // async setCustomClaims(uid) {
    //   const result = await Factor.$endpoint.request({
    //     endpoint: "@factor/service-firebase-auth-endpoint",
    //     action: "customClaims",
    //     uid
    //   })

    //   if (result) {
    //     const { refresh } = result

    //     if (refresh) {
    //       await this.client.auth().currentUser.getIdToken(refresh)
    //       tokenResult = await this.client.auth().currentUser.getIdTokenResult(refresh)
    //     }

    //     return true
    //   } else {
    //     return false
    //   }
    // }

    // authGetPrivs(parsedToken) {
    //   const privs = {}
    //   const { claims } = parsedToken

    //   if (tokenResult) {
    //     const userRoles = Factor.$user.roles

    //     Object.keys(userRoles).forEach(key => {
    //       if (claims[key]) {
    //         privs[key] = claims[key]
    //       }
    //     })
    //   }

    //   return privs
    // }

    async authUpdateUser(user) {
      const _ = this.client.auth().currentUser

      const { displayName, photoURL, email } = user

      if (displayName && displayName !== _.displayName) {
        await _.updateProfile({ displayName })
      }

      if (photoURL && photoURL !== _.photoURL) {
        await _.updateProfile({ photoURL })
      }

      if (email && email !== _.email) {
        await _.updateEmail(email)
        this.sendEmailVerification() // ASYNC
      }

      return currentUser
    }

    async sendEmailVerification() {
      return await this.client.auth().currentUser.sendsendEmailVerification()
    }

    async emailPasswordReset({ email }) {
      await this.client.auth().sendPasswordResetEmail(email)
    }

    async phoneSendCode({ phoneNumber }) {
      let result

      if (!phoneNumber) {
        throw new Error("No phone number was entered.")
      }

      window.messageConfirmationResult = await this.client
        .auth()
        .signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)

      return result
    }

    async phoneVerifyCode({ phoneCode }) {
      let user

      if (!window.messageConfirmationResult) {
        throw new Error("Verification code expired.")
      }

      if (!this.client.auth().currentUser) {
        throw new Error("There was an issue connecting to a logged in user account.")
      }

      var credential = await this.client.auth.PhoneAuthProvider.credential(
        window.messageConfirmationResult.verificationId,
        phoneCode
      )

      await this.client.auth().currentUser.linkAndRetrieveDataWithCredential(credential)

      Factor.$events.$emit("user-updated", { location: "verify phone" })

      return user
    }

    async signOut() {
      await this.client.auth().signOut()
    }
  })()
}
