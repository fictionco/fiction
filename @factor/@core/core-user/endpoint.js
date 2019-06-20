const jwt = require("jsonwebtoken")

module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.SECRET = Factor.$config.setting("TOKEN_SECRET")
    }

    async authenticate(params) {
      const { newAccount, email, password, displayName } = params

      let user
      if (newAccount) {
        user = await Factor.$db.run("User", "create", { email, password, displayName })
        return this.credential(user)
      } else {
        user = await Factor.$db.run("User", "findOne", [{ email }, "+password"])

        const compareResult = await user.comparePassword(password)

        if (!compareResult) {
          Factor.$error.throw(401, "Incorrect Login Information.")
        } else {
          return this.credential(user)
        }
      }
    }

    credential(user) {
      user = user.toObject()
      delete user.password
      return {
        ...user,
        token: this.signJWT({ _id: user._id })
      }
    }

    async status({ token }) {
      const decoded = this.verifyJWT(token)

      if (decoded) {
        const { _id } = decoded
        const user = await Factor.$db.run("User", "findOne", [{ _id }])
        console.log("decoded", user)

        return user
      } else {
        return false
      }
    }

    signJWT(payload) {
      return jwt.sign(payload, this.SECRET)
    }

    verifyJWT(token) {
      try {
        return jwt.verify(token, this.SECRET)
      } catch (error) {
        Factor.$error.throw(error)
      }
    }
  })()
}
