export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("before-app", () => {
        this.mixin()

        // Authentication events only work after SSR
        if (!Factor.$isNode) {
          this.initializeUser()
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
        user = await this.request("getUser", { _id })

        Factor.$store.commit("setItem", { item: _id, value: user })
      }

      return user
    }

    async save(user) {
      const _save = { ...user } // mutable

      let { images, covers } = _save

      _save.images = images.filter(_ => _).map(_ => (typeof _ == "object" ? _._id : _))
      _save.covers = covers.filter(_ => _).map(_ => (typeof _ == "object" ? _._id : _))

      try {
        const saved = await this.request("save", _save)
        this.setUser({ user, current: this.isCurrentUser(user._id) })
        return saved
      } catch (error) {
        throw new Error(error)
      }
    }

    async authenticate(params) {
      let user = await this.request("authenticate", params)

      await Factor.$filters.run("authenticated", user)

      if (user) {
        user = await this.initializeUser(user)
      }

      return user
    }

    async logout(args = {}) {
      this.setUser({ user: null, current: true })
      Factor.$events.$emit("logout")
      Factor.$events.$emit("notify", "Successfully logged out.")

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

    async sendEmailVerification({ email }) {
      return await this.request("verifyEmail", { email })
    }

    async initializeUser(user) {
      this._initializedUser = new Promise(async (resolve, reject) => {
        if (this.currentUser()._id && !user) {
          resolve(this.currentUser())
        } else {

          await Factor.$app.client()
          user = await this.retrieveAndSetCurrentUser(user)
          resolve(user)

        }
      })

      return this._initializedUser
    }

    async retrieveAndSetCurrentUser(user) {

      const token = user && user.token ? user.token : this.token() ? this.token() : null

      user = token ? await this.request("retrieveUser", { token }) : {}

      // Prevent hydration errors
      // If current user is set too quickly Vue is throwing a mismatch error
      this.setUser({ user, token, current: true })

      return user
    }

    // Utility function that calls a callback when the user is set initially
    // If due to route change then initialized var is set and its called immediately
    async init(callback) {
      const user = await this._initializedUser

      if (callback) callback(user)

      return user
    }

    isCurrentUser(_id) {
      return this.currentUser()._id == _id ? true : false
    }

    currentUser() {
      return Factor.$store.getters["getItem"]("currentUser") || {}
    }

    isLoggedIn() {
      return !!!Factor.$lodash.isEmpty(this.currentUser())
    }

    setUser({ user, token, current = false }) {
      const { _id } = user ? user : {}

      if (current) {
        if (token && user) this.token(token)
        else if (user === null) this.token(null)

        Factor.$store.commit("setItem", { item: "currentUser", value: user })
        localStorage[user ? "setItem" : "removeItem"]("user", JSON.stringify(user))
      }

      Factor.$store.commit("setItem", { item: _id, value: user })
    }

    _id() {
      return this.currentUser() && this.currentUser()._id ? this.currentUser()._id : ""
    }

    _item(key) {
      const user = this.currentUser()
      return user[key]
    }

    async sendPasswordReset({ email }) {
      return await this.request("passwordReset", { email })
    }

    async sendEmailVerification(email) {
      return await this.request("verifyEmail", { email })
    }

    token(token) {
      if (typeof localStorage == "undefined") {
        return ""
      }
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
    can({ role, accessLevel }) {
      const userAccessLevel = this.currentUser().accessLevel
      const roleAccessLevel = role ? Factor.$userRoles.roles()[role] : 1000
      if (accessLevel && userAccessLevel >= accessLevel) {
        return true
      } else if (role && userAccessLevel >= roleAccessLevel) {
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

        if (auth === true && !user._id) {
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

        this.init(user => {

          if (auth === true && (!user || !user._id)) {
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
