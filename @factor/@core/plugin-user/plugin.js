module.exports.default = Factor => {
  return new (class {
    constructor() {
      // Fire the init triggers only once
      this.initialized = false

      // Where the cached user is stored
      this.cacheKey = "factorUser"

      this.filters()
      this.events()
    }

    filters() {
      Factor.$filters.addFilter("mixins", _ => {
        _.user = this.mixin()
        return _
      })
    }

    config() {
      return require("./config")
    }

    roles() {
      return this.config().roles
    }

    publicFields() {
      return Factor.$filters.apply("user-public-fields", this.config().publicFields)
    }

    getPostTypes() {
      const icon = Factor.FACTOR_ENV == "app" ? require("./img/users.svg") : ""
      const initialPostTypes = [
        {
          type: "user",
          base: "",
          icon
        }
      ]

      return Factor.$filters.apply("post-types", initialPostTypes).map(_ => {
        return {
          ..._,
          base: typeof _.base == "undefined" ? _.type : _.base,
          name: Factor.$utils.toLabel(_.type)
        }
      })
    }

    role() {
      const user = this.getUser() || {}
      const { role = {} } = user

      console.log("USER ROLE", user)

      return Object.keys(role).map(_ => {
        return { title: _, level: role[_] }
      })[0]
    }

    events() {
      // Has to be after client load to avoid SSR conflicts
      Factor.$events.$on("app-mounted", () => {
        this.start()
      })

      Factor.$events.$on("user-updated", ({ uid }) => {
        this.setActiveUser({ uid, from: "refresh" })
      })

      Factor.$events.$on("auth-init", ({ uid }) => {
        this.setActiveUser({ uid, from: "auth" })
      })

      Factor.$events.$on("auth-user-signed-in", ({ user }) => this.dbUserUpdate(user))
    }

    start() {
      this.cachedUser = this.getCachedUser()

      if (this.cachedUser) {
        this.storeUser({ user: this.cachedUser, from: "cache" })
      }
    }

    // Utility function that calls a callback when the user is set initially
    // If due to route change then initialized var is set and its called immediately
    init(callback) {
      if (this.initialized) {
        callback.call(this, this.uid())
      } else {
        Factor.$events.$on("user-init", () => {
          const uid = this.getUser().uid || false
          callback.call(this, this.uid())
        })
      }
    }

    uid() {
      return this.getUser().uid || false
    }

    field(field) {
      return this.getUser()[field] || ""
    }

    getUser() {
      return Factor.$store.getters["getItem"]("activeUser") || {}
    }

    async request(uid = null) {
      let user
      const storedValue = Factor.$store.getters["getItem"](uid) || false

      if (storedValue) {
        user = storedValue
      } else if (uid) {
        user = await Factor.$db.read({
          collection: "public",
          id: uid
        })

        Factor.$store.commit("setItem", { item: uid, value: user })
      } else {
        console.warn("UID request was null")
      }

      return user
    }

    storeUser({ user, from }) {
      const { uid } = user
      // Don't set user and trigger all hooks if unneeded.
      if (from == "cache" || !Factor.$lodash.isEqual(this.getUser(), user)) {
        Factor.$store.commit("setItem", { item: "activeUser", value: user })
        Factor.$store.commit("setItem", { item: uid, value: user })
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

    clearActiveUser() {
      const uid = this.uid()
      Factor.$store.commit("setItem", { item: "activeUser", value: {} })
      Factor.$store.commit("setItem", { item: uid, value: {} })
    }

    async setActiveUser({ uid, from }) {
      uid = uid ? uid : this.getUser().uid
      const user = uid ? await this.requestFullUser(uid) : {}

      this.storeUser({ user, from })
    }

    async requestFullUser(uid) {
      uid = uid ? uid : this.getUser().uid || false

      if (!uid) return {}

      const publicData = await Factor.$db.read({
        collection: "public",
        id: uid
      })

      const { permalink } = publicData
      if (permalink && permalink.startsWith("@")) {
        publicData.permalink = permalink.replace("@", "")
      }

      const privateData = await Factor.$db.read({
        collection: "private",
        id: uid
      })

      // Public data should have priority over private
      // If a value is in both, should choose the public one first
      const userData = { uid, ...privateData, ...publicData }

      return userData
    }

    setCacheUser(user) {
      if (localStorage) {
        localStorage.setItem(this.cacheKey, user ? JSON.stringify(user) : false)
      }
    }

    getCachedUser() {
      return localStorage && localStorage[this.cacheKey]
        ? JSON.parse(localStorage[this.cacheKey])
        : false
    }

    async constructSaveObject(allUserFields) {
      let userPublic = {}
      let userPrivate = Object.assign({}, allUserFields)

      const publicFields = this.publicFields()

      // Get the fields that should be saved for public use
      publicFields.forEach(i => {
        if (allUserFields[i]) {
          userPublic[i] = allUserFields[i]
        }
      })

      const noSaveFields = ["auths"]
      // Remove everything we don't want saved as private info
      publicFields.concat(noSaveFields).forEach(i => {
        if (userPrivate[i]) {
          delete userPrivate[i]
        }
      })

      let { username, uid } = userPublic
      if (username) {
        userPublic.username = await Factor.$posts.permalinkVerify({
          permalink: username,
          id: uid,
          field: "username"
        })
      }

      return { userPublic, userPrivate }
    }

    // Updates the user private/public datastore
    // Should merge provided data with existing
    async dbUserUpdate(user) {
      const { uid } = user
      const { userPublic, userPrivate } = await this.constructSaveObject(user)

      const savePublic = Factor.$db.update({
        collection: "public",
        type: "user",
        id: uid,
        data: userPublic
      })
      const savePrivate = Factor.$db.update({
        collection: "private",
        type: "user",
        id: uid,
        data: userPrivate
      })

      await Promise.all([savePublic, savePrivate])

      Factor.$events.$emit("user-saved", { uid })

      return true
    }

    mixin() {
      return () => {
        Factor.mixin({
          computed: {
            $activeUser() {
              return this.$store.getters["getItem"]("activeUser") || {}
            },
            $uid() {
              return this.$activeUser && this.$activeUser.uid ? this.$activeUser.uid : ""
            }
          }
        })
      }
    }
  })()
}
