export default Factor => {
  return {
    name: "user",
    callback: _s => {
      // PASSWORDS
      _s.methods.comparePassword = async function comparePassword(candidate) {
        return bcrypt.compare(candidate, this.password)
      }
      _s.pre("save", async function(next) {
        const user = this
        if (!user.isModified("password")) {
          return next()
        }

        try {
          user.password = await _this.hashPassword(user.password)
          return next()
        } catch (error) {
          return next(error)
        }
      })

      Factor.$filters.apply("user-schema-hooks", _s)
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

      covers: [{ type: Factor.$mongoose.Schema.Types.ObjectId, ref: "attachment" }],
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
