const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.SECRET = Factor.$config.setting("TOKEN_SECRET")

      if (!this.SECRET) {
        Factor.$filters.callback("initial-server-start", () => {
          Factor.$log.warn("No auth token secret provided. (.env/TOKEN_SECRET)")
        })

      }

      Factor.$filters.callback("endpoints", { id: "user", handler: this })

      Factor.$filters.callback("data-schemas", () => require("./schema").default(Factor), { signature: 'user' })
    }

    model() {
      return Factor.$db.model("user")
    }

    async save(data, { bearer }) {
      Factor.$db.canEdit({ doc: data, bearer, scope: "memberOrAdmin" })

      const _user = data.user ? data.user : await this.model().findById(data._id)

      Object.assign(_user, data)
      return await _user.save()
    }

    async authenticate(params) {
      const { newAccount, email, password, displayName } = params

      let user
      if (newAccount) {
        try {
          user = await this.model().create({ email, password, displayName })
        } catch (error) {

          const e = error.code == 11000 ? `Account with email: "${email}" already exists.` : error
          throw new Error(e)
        }

        Factor.$filters.apply("create-new-user", user)
        return this.credential(user)
      } else {
        user = await this.model().findOne({ email }, "+password")

        const compareResult = user ? await user.comparePassword(password) : false

        if (!compareResult) {
          throw new Error("Incorrect Login Information.")
        } else {
          user.signedInAt = Date.now()
          await user.save()

          return this.credential(user)
        }
      }
    }

    credential(user) {
      if (!user) {
        return {}
      }
      user = user.toObject()
      delete user.password
      return {
        ...user,
        token: jwt.sign({ _id: user._id }, this.SECRET)
      }
    }

    async account({ _id }) {
      let user = await this.model().findOne({ _id })

      return user
    }

    async getUser({ _id, mode = "app" }) {
      let pop = ""
      if (mode == "app") {
        pop = "avatar"
      } else if (mode == "profile") {
        pop = "avatar images covers"
      }

      let user = await Factor.$user
        .model()
        .findOne({ _id })
        .populate(pop)

      return user
    }

    // Retrieve basic user document
    async retrieveUser({ token, mode = "app" }) {
      let decoded
      try {
        decoded = jwt.verify(token, this.SECRET)
      } catch (error) {
        throw new Error(error)
      }


      if (decoded && decoded._id) {
        const { _id } = decoded

        return await this.getUser({ _id, mode })
      } else {
        return {}
      }
    }


  })()
}
