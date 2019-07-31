const jwt = require("jsonwebtoken")

module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("webpack-ignore-modules", _ => [..._, "bcrypt"])
      this.SECRET = Factor.$config.setting("TOKEN_SECRET")

      if (!this.SECRET) {
        Factor.$filters.callback("initial-server-start", () => {
          Factor.$log.warn("No auth token secret provided. (.env/TOKEN_SECRET)")
        })
      }

      Factor.$filters.callback("endpoints", { id: "user", handler: this })

      Factor.$filters.add("data-schemas", _ => {
        _.user = require("./schema").default(Factor)
        return _
      })
    }

    async authenticate(params) {
      const { newAccount, email, password, displayName } = params

      let user
      if (newAccount) {
        try {
          user = await Factor.$dbServer
            .model("user")
            .create({ email, password, displayName })
        } catch (error) {
          const e =
            error.code == 11000 ? `Account with email: "${email}" already exists.` : error
          throw new Error(e)
        }

        Factor.$filters.apply("create-new-user", user)
        return this.credential(user)
      } else {
        user = await Factor.$dbServer.model("user").findOne({ email }, "+password")

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

    decodeToken(token) {
      try {
        return jwt.verify(token, this.SECRET)
      } catch (error) {
        throw new Error(error)
      }
    }
  })()
}
