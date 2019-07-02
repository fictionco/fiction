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
      return await _user.save()
    }

    async hashPassword(password) {
      const SALT_ROUNDS = 10
      return await bcrypt.hash(password, SALT_ROUNDS)
    }

    async authenticate(params) {
      const { newAccount, email, password, displayName } = params

      let user
      if (newAccount) {
        user = await Factor.$db.model("User").create({ email, password, displayName, emailVerificationCode })

        Factor.$filters.apply("create-new-user", user)

        return this.credential(user)
      } else {
        user = await Factor.$db.model("User").findOne({ email }, "+password")

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

    async account({ _id }) {
      let user = await Factor.$db.model("User").findOne({ _id })
      // .populate("photoPrimary photosProfile photosCover")

      return user
    }

    async getUser({ _id, mode = "app" }) {
      let pop = ""
      if (mode == "app") {
        pop = "photoPrimary"
      } else if (mode == "profile") {
        pop = "photoPrimary photosProfile photosCover"
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
            } catch (error) {
              return next(error)
            }
          })

          Factor.$filters.apply("user-schema-hooks", Schema)
        },
        schema: Factor.$filters.apply("user-schema", {
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
          emailVerified: { type: Boolean, default: false },
          emailVerificationCode: { type: String, select: false },
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
          },
          birthday: Date,
          about: String,
          photoPrimary: { type: Schema.Types.ObjectId, ref: "Image" },
          photosProfile: [{ type: Schema.Types.ObjectId, ref: "Image" }],
          photosCover: [{ type: Schema.Types.ObjectId, ref: "Image" }],
          profile: {}
        }),
        options: {}
      }
    }
  })()
}
