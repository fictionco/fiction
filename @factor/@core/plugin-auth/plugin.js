export default Factor => {
  return new (class {
    constructor() {
      // Authentication events only work after SSR
      if (Factor.$isNode) {
        return
      }

      this.events()
      this.handleAuthRouting()
      this.initialized = false
    }

    handleAuthRouting() {
      Factor.$filters.add("client-route-before-promises", (_, { to, from, next }) => {
        const user = Factor.$user.getUser()
        const { path: toPath } = to

        // Is authentication needed
        const auth = to.matched.some(_r => {
          return _r.meta.auth
        })

        // Get accessLevel needed
        let accessLevel = 0
        to.matched.forEach(_r => {
          if (_r.meta.accessLevel) {
            accessLevel = _r.meta.accessLevel
          }
        })

        if (auth === true && !user) {
          Factor.$events.$emit("signin-modal", {
            redirect: toPath
          })
          next(false)
        }
      })

      Factor.$filters.add("client-route-loaded", (_, { to, from }) => {
        const auth = to.matched.some(_r => {
          return _r.meta.auth
        })

        Factor.$user.init(uid => {
          console.log("USER INIT", uid)
          if (auth === true && !uid) {
            Factor.$router.push({
              path: "/signin",
              query: { redirect: to.path, from: from.path }
            })
          }
        })
      })
    }

    events() {
      Factor.$events.$on("auth-state-changed", ({ uid }) => {
        if (!uid) {
          this.removeAuth()
        }
        console.log("AUTH STATE", uid)

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
  })()
}
