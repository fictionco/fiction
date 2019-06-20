export default Factor => {
  return new (class {
    constructor() {
      // Authentication events only work after SSR
      if (Factor.$isNode) {
        return
      }

      this.initializeClient()
      this.handleAuthRouting()
      this.initialized = false
    }

    async run(method, params) {
      return await Factor.$endpoint.request({ id: "auth", method, params })
    }

    async initializeClient() {
      const result = this.token() ? await this.run("status", { token: this.token() }) : null
      Factor.$events.$emit("auth-init", result)
      this.initialized = true
    }

    async authenticate(args) {
      try {
        const result = await this.run("authenticate", args)
        await Factor.$filters.run("authenticated", result)
        return result
      } catch (error) {
        throw new Error(error)
      }
    }

    async logout(args = {}) {
      this.token(false)
      Factor.$events.$emit("logout")

      if (args.redirect || Factor.$router.currentRoute.matched.some(r => r.meta.auth)) {
        const { redirect: path = "/" } = args
        Factor.$router.push({ path })
      } else {
        Factor.$events.$emit("reset-ui")
      }
    }

    async sendPasswordReset({ email }) {
      return await this.run("passwordReset", { email })
    }

    async sendEmailVerification(email) {
      return await this.run("verifyEmail", { email })
    }

    token(token) {
      const keyName = "jwtToken"
      if (token === false) {
        localStorage.removeItem(keyName)
      } else if (token) {
        localStorage.setItem(keyName, JSON.stringify(token))
      } else {
        return localStorage.getItem(keyName)
      }
    }

    handleAuthRouting() {
      Factor.$filters.add("client-route-before-promises", (_, { to, from, next }) => {
        const user = Factor.$user.activeUser()
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
  })()
}
