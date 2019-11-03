import { objectIdType } from "@factor/post/util"
import { validator, applyFilters, pushToFilter } from "@factor/tools"

export default () => {
  // Ignore in app  (loaded in server + app)
  pushToFilter("webpack-ignore-modules", "bcrypt")

  return {
    name: "user",
    callback: _s => {
      // PASSWORDS
      _s.methods.comparePassword = async function comparePassword(candidate) {
        return require("bcrypt").compare(candidate, this.password)
      }
      _s.pre("save", async function(next) {
        const user = this
        if (!user.isModified("password")) {
          return next()
        }

        try {
          user.password = await bcrypt.hash(user.password, 10)
          return next()
        } catch (error) {
          return next(error)
        }
      })

      _s.pre("save", function(next) {
        if (this.username) this.permalink = `@${this.username}`

        next()
      })

      applyFilters("user-schema-hooks", _s)
    },
    schema: applyFilters("user-schema", {
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
          validator: v => validator.isEmail(v),
          message: props => `${props.value} is not a valid email.`
        }
      },
      emailVerified: { type: Boolean, default: false },
      password: {
        select: false,
        type: String,
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
          validator: v => validator.isMobilePhone(v),
          message: props =>
            `${props.value} is not a valid phone number (with country code).`
        }
      },

      covers: [{ type: objectIdType(), ref: "attachment" }],
      birthday: Date,
      gender: {
        type: String,
        enum: ["male", "female"]
      },
      about: String
    }),
    options: {
      toObject: { virtuals: true },
      toJSON: { virtuals: true }
    }
  }
}
