import { requestPostSingle } from "@factor/post"
import {
  isEmpty,
  isNode,
  emitEvent,
  addFilter,
  pushToFilter,
  runCallbacks
} from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      addFilter("before-app", () => {
        this.mixin()

        // Authentication events only work after SSR
        if (!isNode) {
          this.initializeUser()
          this.handleAuthRouting()
        }
      })

      pushToFilter("data-schemas", () => require("./schema").default(Factor), {
        key: "user"
      })
    }

    // Utility function that calls a callback when the user is set initially
    // If due to route change then initialized var is set and its called immediately
    async init(callback) {
      const user = await this._initializedUser

      if (callback) callback(user)

      return user
    }

    async initializeUser(user) {
      this._initializedUser = new Promise(async (resolve, reject) => {
        if (this.currentUser()._id && !user) {
          user = this.currentUser()
        } else {
          await Factor.$app.client()
          user = await this.retrieveAndSetCurrentUser(user)
        }

        await runCallbacks("before-user-init", user)

        resolve(user)
      })

      return this._initializedUser
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

    async authenticate(params) {
      let user = await this.request("authenticate", params)

      await runCallbacks("authenticated", user)

      if (user) {
        user = await this.initializeUser(user)
      }

      return user
    }

    async logout(args = {}) {
      this.setUser({ user: null, current: true })
      emitEvent("logout")
      emitEvent("notify", "Successfully logged out.")

      if (args.redirect || Factor.$router.currentRoute.matched.some(r => r.meta.auth)) {
        const { redirect: path = "/" } = args
        Factor.$router.push({ path })
      } else {
        emitEvent("reset-ui")
      }
    }

    async sendPasswordReset({ email }) {
      return await this.request("passwordReset", { email })
    }

    async sendEmailVerification({ email }) {
      return await this.request("verifyEmail", { email })
    }

    async retrieveAndSetCurrentUser(user) {
      const token = user && user.token ? user.token : (this.token() ? this.token() : null)

      try {
        user = token ? await requestPostSingle({ token }) : {}

        this.setUser({ user, token, current: true })

        return user
      } catch (error) {
        // If JWT auth fails then delete token, etc.
        if (error.message.includes("invalid signature")) {
          this.setUser({ user: null, current: true })
        }

        console.error(error)
      }
    }

    isCurrentUser(_id) {
      return this.currentUser()._id == _id ? true : false
    }

    currentUser() {
      return Factor.$store.val("currentUser") || {}
    }

    isLoggedIn() {
      return !!!isEmpty(this.currentUser())
    }

    setUser({ user, token, current = false }) {
      const { _id } = user ? user : {}

      if (current) {
        if (token && user) this.token(token)
        else if (user === null) this.token(null)

        Factor.$store.add("currentUser", user)
        localStorage[user ? "setItem" : "removeItem"]("user", JSON.stringify(user))
      }

      Factor.$store.add(_id, user)
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
      if (typeof localStorage == "undefined" || !localStorage) {
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
      Factor.$filters.callback("client-route-before", async ({ to, from, next }) => {
        const user = await this.init() //this.currentUser()
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
          emitEvent("signin-modal", {
            redirect: toPath
          })
          next(false)
        }
      })

      Factor.$filters.callback("before-user-init", user => {
        const { path, matched } = Factor.$router.currentRoute
        const auth = matched.some(_r => _r.meta.auth)

        if (auth === true && (!user || !user._id)) {
          Factor.$router.push({
            path: "/signin",
            query: { redirect: path }
          })
        }
      })
    }
  })()
}
