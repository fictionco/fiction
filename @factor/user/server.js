import { addFilter, pushToFilter, applyFilters, addCallback } from "@factor/tools"
import { getModel } from "@factor/post/server"
import jwt from "jsonwebtoken"

export default Factor => {
  return new (class {
    constructor() {
      addFilter("webpack-ignore-modules", _ => [..._, "bcrypt"])
      this.SECRET = process.env.TOKEN_SECRET

      if (!this.SECRET) {
        addFilter("setup-needed", _ => {
          const item = {
            title: "JWT Secret",
            value: "A JWT string secret, used for verifying authentication status.",
            location: ".env/TOKEN_SECRET"
          }

          return [..._, item]
        })
      }

      addCallback("endpoints", { id: "user", handler: this })

      pushToFilter("data-schemas", () => require("./schema").default(Factor), {
        key: "user"
      })
    }

    async authenticate(params) {
      const { newAccount, email, password, displayName } = params

      let user
      if (newAccount) {
        try {
          user = await getModel("user").create({ email, password, displayName })
        } catch (error) {
          const e =
            error.code == 11000 ? `Account with email: "${email}" already exists.` : error
          throw new Error(e)
        }

        applyFilters("create-new-user", user)
        return this.credential(user)
      } else {
        user = await getModel("user").findOne({ email }, "+password")

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
