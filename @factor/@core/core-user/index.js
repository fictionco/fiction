export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("before-app", () => {
        this.mixin()

        // Authentication events only work after SSR
        if (!Factor.$isNode) {
          this._initializedUser = this.initializeUser()
          this.handleAuthRouting()
        }
      })
    }

    mixin() {
      Factor.mixin({
        computed: {
          $currentUser() {
            return this.$store.getters["getItem"]("currentUser") || {}
          },
          $userId() {
            return this.$currentUser && this.$currentUser._id ? this.$currentUser._id : ""
          }
        }
      })
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "user", method, params })
    }

    async load(_id) {
      let user
      const storedValue = Factor.$store.getters["getItem"](_id) || false

      if (storedValue) {
        user = storedValue
      } else {
        user = await Factor.$db.run("User", "findById", [_id])

        Factor.$store.commit("setItem", { item: _id, value: user })
      }

      return user
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
      this.setCurrentUser(null)
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

    async initializeUser() {
      return new Promise(async (resolve, reject) => {
        if (this.currentUser()) {
          resolve(this.currentUser())
        } else {
          const user = this.token() ? await this.request("retrieveUser", { token: this.token() }) : {}

          // Prevent hydration errors
          // If current user is set too quickly Vue is throwing a mismatch error
          setTimeout(() => {
            this.setCurrentUser(user)

            resolve(user)
          }, 10)
        }
      })
    }

    currentUser() {
      return Factor.$store.getters["getItem"]("currentUser")
    }

    setCurrentUser(user) {
      const { _id, token } = user ? user : {}

      Factor.$store.commit("setItem", { item: "currentUser", value: user })
      Factor.$store.commit("setItem", { item: _id, value: user })

      localStorage[user ? "setItem" : "removeItem"]("user", JSON.stringify(user))
      this.token(token)
    }

    // Utility function that calls a callback when the user is set initially
    // If due to route change then initialized var is set and its called immediately
    async init(callback) {
      const user = await this._initializedUser

      callback(user)
    }

    _id() {
      return this.currentUser() ? this.currentUser()._id : ""
    }

    _item(key) {
      const user = this.currentUser() || {}
      return user[key]
    }

    storeUser({ user, from }) {
      const { uid } = user
      // Don't set user and trigger all hooks if unneeded.
      if (from == "cache" || !Factor.$lodash.isEqual(this.getUser(), user)) {
        Factor.$store.commit("setItem", { item: "currentUser", value: user })
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

    async sendPasswordReset({ email }) {
      return await this.request("passwordReset", { email })
    }

    async sendEmailVerification(email) {
      return await this.request("verifyEmail", { email })
    }

    token(token) {
      const keyName = "token"
      if (token === false || token === null) {
        localStorage.removeItem(keyName)
      } else if (token) {
        localStorage.setItem(keyName, JSON.stringify({ token }))
      } else {
        const v = localStorage.getItem(keyName)
        return v ? JSON.parse(v).token : ""
      }
    }

    // Very basic version of this function for MVP dev
    // Needs improvement for more fine grained control
    can({ ability, accessLevel }) {
      const userAccessLevel = this.currentUser().accessLevel
      if (accessLevel && accessLevel < userAccessLevel) {
        return true
      } else if (ability && userAccessLevel > 100) {
        return true
      } else {
        return false
      }
    }

    handleAuthRouting() {
      Factor.$filters.add("client-route-before-promises", (_, { to, from, next }) => {
        const user = this.currentUser()
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
