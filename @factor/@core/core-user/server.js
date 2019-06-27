const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.SECRET = Factor.$config.setting("TOKEN_SECRET")

      Factor.$filters.callback("endpoints", { id: "user", handler: this })

      Factor.$filters.callback("data-schemas", () => this.schema())
    }

    async save(data, { bearer }) {
      Factor.$db.canEdit({ doc: data, bearer, scope: "memberOrAdmin" })

      const _user = await Factor.$db.run("User", "findById", [data._id])
      Object.assign(_user, data)
      await _user.save()
    }

    async hashPassword(password) {
      const SALT_ROUNDS = 10
      return await bcrypt.hash(password, SALT_ROUNDS)
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

    async retrieveUser({ token }) {
      const decoded = this.verifyJWT(token)

      if (decoded) {
        const { _id } = decoded
        const user = await Factor.$db.run("User", "findOne", [{ _id }])
        return user.toObject()
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

    schema() {
      const _this = this // mongoose hooks need 'this'
      return {
        name: "User",
        callback: Schema => {
          Schema.pre("save", async function(next) {
            const user = this
            if (!user.isModified("password")) return next()

            try {
              user.password = await _this.hashPassword(user.password)
            } catch (error) {
              return next(error)
            }
          })

          Schema.methods.comparePassword = async function comparePassword(candidate) {
            return bcrypt.compare(candidate, this.password)
          }
        },
        schema: {
          username: {
            type: String,
            trim: true,
            index: { unique: true },
            minlength: 3
          },
          email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: { unique: true },
            validate: {
              validator: v => Factor.$validator.isEmail(v),
              message: props => `${props.value} is not a valid email.`
            }
          },
          password: {
            select: false,
            type: String,
            required: true,
            trim: true,
            index: { unique: true },
            minlength: 8
          },
          displayName: {
            type: String,
            trim: true
          },
          phoneNumber: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
            validate: {
              validator: v => Factor.$validator.isMobilePhone(v),
              message: props => `${props.value} is not a valid phone number (with country code).`
            }
          },

          gender: {
            type: String,
            enum: ["male", "female"]
          }
        },
        options: {}
      }
    }
  })()
}
