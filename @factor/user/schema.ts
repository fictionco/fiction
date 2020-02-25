import isEmail from "validator/lib/isEmail"
import isMobilePhone from "validator/lib/isMobilePhone"
import { randomToken, slugify } from "@factor/api/utils"
import { applyFilters } from "@factor/api/hooks"
import bcrypt from "bcryptjs"
import { HookNextFunction, Schema, Document } from "mongoose"
import { FactorSchema } from "@factor/post/types"
import { objectIdType } from "@factor/post/object-id"
import { FactorUser } from "./types"

export default (): FactorSchema => {
  return {
    name: "user",
    permissions: {
      retrieve: { accessLevel: 0 }
    },
    populatedFields: applyFilters("user-populated-fields", [
      { field: "covers", depth: 30 }
    ]),
    callback: (userSchema: Schema): void => {
      /**
       * Password Verification and Handling
       */
      userSchema.methods.comparePassword = async function comparePassword(
        candidate: string
      ): Promise<boolean> {
        return bcrypt.compare(candidate, this.password)
      }

      /**
       * Handle password saving
       */
      userSchema.pre("save", async function(
        this: FactorUser & Document,
        next: HookNextFunction
      ) {
        if (!this.isModified("password") || !this.password) {
          return next()
        }

        try {
          this.password = await bcrypt.hash(this.password, 10)
          return next()
        } catch (error) {
          return next(error)
        }
      })

      /**
       * Set permalink to @[username] to users can have their own url
       */
      userSchema.pre("save", function(
        this: FactorUser & Document,
        next: HookNextFunction
      ) {
        if (this.displayName) {
          this.title = this.displayName
        }

        // set default username
        if (!this.username && this.displayName) {
          this.username = `${slugify(this.displayName)}-${randomToken(3)}`
        } else if (!this.username) {
          this.username = `user-${randomToken(6)}`
        }

        // Users permalink is "@" plus their username
        if (this.username) this.permalink = `@${this.username}`

        next()
      })

      applyFilters("user-schema-hooks", userSchema)
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
          validator: (v: string): boolean => isEmail(v) || false,
          message: `Email is invalid.`
        }
      },
      emailVerified: { type: Boolean, default: false },
      password: {
        select: false,
        type: String,
        trim: true,
        validate: {
          validator: (v: string): boolean => (v.length >= 8 ? true : false),
          message: `Password is shorter than minimum (8 characters)`
        }
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
          validator: (v: string): boolean => isMobilePhone(v),
          message: `Phone number is invalid.`
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
