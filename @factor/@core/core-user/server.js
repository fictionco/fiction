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

      const _user = data.user ? data.user : await Factor.$db.model("User").findById(data._id)

      Object.assign(_user, data)
      return await _user.save()
    }

    async hashPassword(password) {
      const SALT_ROUNDS = 10
      return await bcrypt.hash(password, SALT_ROUNDS)
    }

    async authenticate(params) {
      const { newAccount, email, password, displayName } = params
      console.log("!?", params)
      let user
      if (newAccount) {
        try {
          user = await Factor.$db.model("User").create({ email, password, displayName })
        } catch (error) {
          Factor.$log.error(error, error.code)
        }

        Factor.$filters.apply("create-new-user", user)

        return this.credential(user)
      } else {
        user = await Factor.$db.model("User").findOne({ email }, "+password")

        const compareResult = await user.comparePassword(password)

        if (!compareResult) {
          Factor.$error.throw(401, "Incorrect Login Information.")
        } else {
          user.signedInAt = Date.now()
          await user.save()
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

    async account({ _id }) {
      let user = await Factor.$db.model("User").findOne({ _id })

      return user
    }

    async getUser({ _id, mode = "app" }) {
      let pop = ""
      if (mode == "app") {
        pop = "avatar"
      } else if (mode == "profile") {
        pop = "avatar images covers"
      }

      let user = await Factor.$db
        .model("User")
        .findOne({ _id })
        .populate(pop)

      return user
    }

    // Retrieve basic user document
    async retrieveUser({ token, mode = "app" }) {
      const decoded = this.verifyJWT(token)

      if (decoded) {
        const { _id } = decoded

        return await this.getUser({ _id, mode })
      } else {
        return {}
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
      const { Schema, model } = Factor.$mongoose
      const _this = this // mongoose hooks need 'this'
      return {
        name: "User",
        callback: Schema => {
          // PASSWORDS
          Schema.methods.comparePassword = async function comparePassword(candidate) {
            return bcrypt.compare(candidate, this.password)
          }
          Schema.pre("save", async function(next) {
            const user = this
            if (!user.isModified("password")) return next()

            try {
              user.password = await _this.hashPassword(user.password)
              return next()
            } catch (error) {
              return next(error)
            }
          })

          Factor.$filters.apply("user-schema-hooks", Schema)
        },
        schema: Factor.$filters.apply("user-schema", {
          signedInAt: Date,
          username: {
            type: String,
            trim: true,
            index: { unique: true, sparse: true },
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
          emailVerified: { type: Boolean, default: false },
          password: {
            select: false,
            type: String,
            required: true,
            trim: true,
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
            validate: {
              validator: v => Factor.$validator.isMobilePhone(v),
              message: props => `${props.value} is not a valid phone number (with country code).`
            }
          },
          gender: {
            type: String,
            enum: ["male", "female"]
          },
          birthday: Date,
          about: String,
          covers: [{ type: Schema.Types.ObjectId, ref: "Image" }],
          profile: {}
        }),
        options: {
          toObject: { virtuals: true },
          toJSON: { virtuals: true }
        }
      }
    }
  })()
}
