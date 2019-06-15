module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addSchema()
    }

    addSchema() {
      Factor.$filters.add("data-schemas", _ => {
        return [..._, this.schema()]
      })
    }

    async hashPassword(password) {
      const SALT_ROUNDS = 10
      return await require("bcrypt").hash(password, SALT_ROUNDS)
    }

    schema() {
      return {
        name: "User",
        callback: Schema => {
          Schema.pre("save", async function(next) {
            const user = this
            if (!user.isModified("password")) return next()

            try {
              user.password = await this.hashPassword(user.password)
            } catch (error) {
              return next(error)
            }
          })
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
              validator: require("email-validator").validate,
              message: ({ value }) => `Email "${value}" is not valid.`
            }
          },
          password: {
            type: String,
            required: true,
            trim: true,
            index: { unique: true },
            minlength: 8
          }
        },
        options: {}
      }
    }
  })()
}
