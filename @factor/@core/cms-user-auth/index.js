export default Factor => {
  return new (class {
    constructor() {
      Factor.$stack.register({
        id: `auth-signin`,
        title: "Auth - Signin User",
        description: "Signs in a user.",
        args: "Object { provider }",
        result: "Object { auth (details), user }"
      })

      Factor.$stack.register({
        id: `auth-request-bearer-token`,
        title: "Auth - Bearer Token ID",
        description: "Gets the auth system bearer token ID.",
        result: "String"
      })

      Factor.$stack.register({
        id: `auth-password-reset-email`,
        title: "Auth - Send password reset email",
        description: "Sends a password reset email.",
        result: "String"
      })

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

        Factor.$events.$emit("auth-init", { uid })
        this.initialized = true
      })

      // If 'auth state changed' never fires, initialize after 5s
      setTimeout(() => {
        if (!this.initialized) {
          Factor.$events.$emit("auth-init", { uid: false })
          console.warn("[Auth Service] User auth state was initialized.")
        }
      }, 5000)
    }

    uid() {
      return Factor.$user.getUser().uid || false
    }

    async authenticate(args) {
      const credentials = await Factor.$stack.service("auth-signin", args)

      if (credentials) {
        Factor.$events.$emit("auth-user-signed-in", credentials)

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
      try {
        const results = await Factor.$stack.service("add-auth-method", args)

        this.update()

        return results
      } catch (error) {
        Factor.$events.$emit("error", error)
      }
    }

    async removeAuthMethod(args) {
      try {
        const results = await Factor.$stack.service("remove-auth-method", args)

        this.update()

        return results
      } catch (error) {
        Factor.$events.$emit("error", error)
      }
    }

    async sendPasswordReset({ email }) {
      return await Factor.$stack.service("auth-password-reset-email", { email })
    }

    async sendEmailVerification(email) {
      return await Factor.$stack.service("send-email-verification", { email })
    }

    async getRequestBearerToken() {
      return await Factor.$stack.service("auth-request-bearer-token")
    }

    update(args = {}) {
      Factor.$events.$emit("user-updated", args)
    }
  })()
}
