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
        id: "save-user",
        description: "Saves relevant user information to auth user",
        service: _ => this.authUpdateUser(_)
      })

      Factor.$stack.cover({
        provider: "firebase",
        id: "get-user-data",
        description: "Ensures stored user data matches auth user data",
        service: _ => this.getUserData(_)
      })

      Factor.$stack.cover({
        provider: "firebase",
        id: "add-auth-method",
        description: "Links a new authentication method",
        service: _ => this.linkProvider(_)
      })

      Factor.$stack.cover({
        provider: "firebase",
        id: "remove-auth-method",
        description: "Removes an authentication method",
        service: _ => this.unlinkProvider(_)
      })

      Factor.$stack.cover({
        provider: "firebase",
        id: "auth-request-bearer-token",
        description: "Returns firebase user id token.",
        service: _ => this.getIdToken()
      })

      Factor.$stack.cover({
        provider: "firebase",
        id: "auth-password-reset-email",
        service: _ => this.emailPasswordReset(_)
      })

      const firebaseApp = require("@factor/service-firebase-app").default

      require("firebase/auth")

      this.client = firebaseApp(Factor).getClient()

      if (this.client) {
        Factor.$filters.callback("after-initialize-app", () => this.events())
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

      if (firebaseUserCredential && !firebaseUserCredential.user.emailVerified) {
        await this.sendEmailVerification()
      }

      return this.firebaseToFactorCredential(firebaseUserCredential)
    }

    async getProviderCredential(args) {
      const { provider = "", form = {}, newAccount = false, linkNew } = args

      let credential
      if (provider.includes("facebook")) {
        const { accessToken } = await Factor.$stack.service(`auth-provider-tokens-facebook`)
        credential = this.client.auth.FacebookAuthProvider.credential(accessToken)
      } else if (provider.includes("google")) {
        const options = linkNew ? { prompt: "select_account" } : {}
        const { idToken, accessToken } = await Factor.$stack.service(`auth-provider-tokens-google`, options)

        credential = this.client.auth.GoogleAuthProvider.credential(idToken, accessToken)
      } else if (provider.includes("email")) {
        const { email, password, displayName } = form
        if (newAccount) {
          await this.client.auth().createUserWithEmailAndPassword(email, password)
          const currentUser = this.client.auth().currentUser
          if (displayName) {
            await currentUser.updateProfile({ displayName })
          }
        }
        credential = this.client.auth.EmailAuthProvider.credential(email, password)
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

      const factorUser = await this.firebaseToFactorUser()
      return {
        auth: {
          isNewUser,
          ...credential
        },
        user: factorUser
      }
    }

    async firebaseToFactorUser() {
      const firebaseUser = this.client.auth().currentUser
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

      // Firebase user object refinement
      if (firebaseUser.metadata) {
        clean.createdAt = Factor.$time.stamp(firebaseUser.metadata.creationTime)
        clean.signedInAt = Factor.$time.stamp(firebaseUser.metadata.lastSignInTime)
      }

      // Private Auth Information (current user)
      clean.auths = firebaseUser.providerData

      return clean
    }

    async linkProvider(args) {
      const { provider } = args

      args.linkNew = true
      if (provider.includes("email")) {
        await this.sendEmailVerification()
      } else {
        const credential = await this.getProviderCredential(args)

        await this.client.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
      }

      return
    }

    async unlinkProvider({ provider }) {
      provider = provider == "google" ? "google.com" : provider
      provider = provider == "facebook" ? "facebook.com" : provider
      return await this.client.auth().currentUser.unlink(provider)
    }

    async getUserData(userData) {
      // const currentUser = this.client.auth().currentUser

      // userData.email = currentUser.email

      const fb = await this.firebaseToFactorUser()

      return { ...userData, ...fb }
    }

    async authUpdateUser(user) {
      console.log("update user", user)
      const currentUser = this.client.auth().currentUser

      const { displayName, photoURL, email, password } = user
      try {
        if (displayName && displayName !== currentUser.displayName) {
          await currentUser.updateProfile({ displayName })
        }

        if (photoURL && photoURL !== currentUser.photoURL) {
          await currentUser.updateProfile({ photoURL })
        }

        if (password) {
          await currentUser.updatePassword(password)
        }

        if (email && email !== currentUser.email) {
          await currentUser.updateEmail(email)
          this.sendEmailVerification() // ASYNC
        }
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          Factor.$events.$emit("signin-modal", {
            mode: "reauth",
            force: "popup",
            title: "Please Login Again",
            subTitle: "This action requires that you have signed in recently.",
            callback: () => {
              Factor.$user.save(user)
            }
          })
        }
        throw new Error(error)
      }

      return user
    }

    async sendEmailVerification() {
      return await this.client.auth().currentUser.sendEmailVerification()
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
