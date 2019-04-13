export default Factor => {
  return new class {
    constructor() {
      // Authentication events only work after SSR
      if (Factor.$isNode) {
        return
      }

      this.events()
      this.initialized = false
    }

    events() {
      Factor.$events.$on("auth-state-changed", ({ uid }) => {
        if (!uid) {
          this.removeAuth()
        }

        Factor.$events.$emit("auth-init", { uid })
        this.initialized = true
      })

      // If 'auth state changed' never fires, initialize after 5s
      setTimeout(() => {
        if (!this.initialized) {
          Factor.$events.$emit("auth-init", { uid: false })
          console.warn("[Factor] Auth state didn't initialize.")
        }
      }, 5000)
    }

    uid() {
      return Factor.$user.getUser().uid || false
    }

    async authenticate(args) {
      const served = await Factor.$filters.applyService({
        service: "auth",
        filter: "auth-signin",
        args
      })

      const credentials = served[0] ? served[0].result : false

      if (credentials) {
        Factor.$events.$emit("auth-user-signed-in", credentials)

        //  this.setUserRoles(credentials)

        const { uid } = credentials
        this.update({ uid })
      }

      return credentials
    }

    // async setUserRoles(credentials) {
    //   const result = await Factor.$endpoint.request({
    //     endpoint: "privs",
    //     action: "apply"
    //   })

    //   // If new privs are set,
    //   // then user auth/tokens need a reset
    //   if (result.refresh) {
    //     Factor.$events.$emit("auth-refresh-tokens", credentials)
    //   }
    // }

    async logout(args = {}) {
      console.log("[Auth] Logout", args)
      this.removeAuth()

      const path = args.redirect || "/"

      if (args.redirect) {
        Factor.$router.push({ path })
      } else if (Factor.$router.currentRoute.matched.some(r => r.meta.auth)) {
        Factor.$router.push({ path })
      } else {
        Factor.$events.$emit("reset-ui")
      }

      Factor.$events.$emit("auth-logout", { uid: this.uid(), ...args })
    }

    async removeAuth() {
      Factor.$user.clearActiveUser()
      Factor.$events.$emit("auth-remove", { uid: this.uid() })
    }

    async addAuthMethod(args) {
      const processors = Factor.$filters.apply("add-auth-method-promises", [], args)
      const results = await Promise.all(processors)

      this.update()

      return results
    }

    async removeAuthMethod(args) {
      const processors = Factor.$filters.apply("remove-auth-method-promises", [], args)
      const results = await Promise.all(processors)

      this.update()

      return results
    }

    async sendPasswordReset(email) {
      const promises = Factor.$filters.apply("send-password-reset", [], email)
      return await Promise.all(promises)
    }

    async sendEmailVerification(email) {
      const promises = Factor.$filters.apply("send-email-verification", [], email)
      return await Promise.all(promises)
    }

    async getRequestBearerToken() {
      const served = await Factor.$filters.applyService({
        service: "auth",
        filter: "auth-request-bearer-token"
      })

      const token = served && served[0] ? served[0].result : false
      return token
    }

    update(args) {
      Factor.$events.$emit("user-updated", args)
    }
  }()
}
