const bcrypt = require("bcrypt")
module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.SECRET = Factor.$config.setting("TOKEN_SECRET")

      Factor.$filters.callback("endpoints", { id: "auth", handler: require("./endpoint").default(Factor) })

      this.addSchema()
    }

    addSchema() {
      Factor.$filters.add("data-schemas", _ => {
        return [..._, this.schema()]
      })
    }

    async hashPassword(password) {
      const SALT_ROUNDS = 10
      return await bcrypt.hash(password, SALT_ROUNDS)
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
          }
        },
        options: {}
      }
    }
  })()
}
