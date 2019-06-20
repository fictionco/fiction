export default Factor => {
  return new (class {
    constructor() {
      // Authentication events only work after SSR
      if (Factor.$isNode) {
        return
      }

      Factor.$filters.add("run-app", () => {
        this.initializeClient()
        this.handleAuthRouting()
      })
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "auth", method, params })
    }

    async authenticate(params) {
      try {
        const result = await this.request("authenticate", params)
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
      return await this.request("passwordReset", { email })
    }

    async sendEmailVerification(email) {
      return await this.request("verifyEmail", { email })
    }

    async initializeClient() {
      const result = this.token() ? await this.request("status", { token: this.token() }) : {}
      console.log("result of token", result)
      this.setActiveUser(result)
      this.initialized = true
    }

    setActiveUser(user) {
      const { uid } = user
      Factor.$store.commit("setItem", { item: "activeUser", value: user })
      Factor.$store.commit("setItem", { item: uid, value: user })
      localStorage.setItem("user", JSON.stringify(user))
    }

    // Utility function that calls a callback when the user is set initially
    // If due to route change then initialized var is set and its called immediately
    async init(callback) {
      if (this.activeUser()) {
        callback.call(this, this.activeUser())
      } else {
        await this.initializeClient()
        Factor.$events.$on("user-init", () => {
          callback.call(this, this.uid())
        })
      }
    }

    uid() {
      return this.activeUser() ? this.activeUser().uid : ""
    }

    activeUser() {
      return Factor.$store.getters["getItem"]("activeUser")
    }

    storeUser({ user, from }) {
      const { uid } = user
      // Don't set user and trigger all hooks if unneeded.
      if (from == "cache" || !Factor.$lodash.isEqual(this.getUser(), user)) {
        Factor.$store.commit("setItem", { item: "activeUser", value: user })
        Factor.$store.commit("setItem", { item: uid, value: user })
        localStorage.setItem("user", user ? JSON.stringify(user) : false)
        this.setCacheUser(user)
        Factor.$events.$emit("user-set", user)
      }

      // Send a global event when the user is definitively initiated
      // If !user then wait til auth system verifies they are logged out
      if (!this.initialized && ((user && from == "cache") || from == "auth")) {
        Factor.$events.$emit("user-init", { user, from })
        this.initialized = true
      }
    }

    async authenticate(args) {
      try {
        const result = await this.request("authenticate", args)
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
      return await this.request("passwordReset", { email })
    }

    async sendEmailVerification(email) {
      return await this.request("verifyEmail", { email })
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
        const user = this.activeUser()
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

        this.init(uid => {
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
