import { addFilter, setting } from "@factor/api"
import { writeConfig, SetupCliConfig } from "@factor/cli/setup"
import inquirer from "inquirer"
import { Schema, SchemaDefinition, HookNextFunction, Document } from "mongoose"
import { UpdateManySetter, UpdateManyOptions } from "@factor/post/server"
import { FactorUser, userRolesMap, UserRoles } from "./types"
interface FactorUserRoles extends FactorUser {
  role: string;
  accessLevel: number;
}

/**
 * Mongoose middleware to allow admins to edit user roles in the admin
 * @param this - the query
 * @param next - mongoose next function
 *
 * @library mongoose
 */
const validateUpdateManyQuery = async function(
  this: FactorUserRoles &
    Document & { _update: UpdateManySetter; options: UpdateManyOptions },
  next: HookNextFunction
): Promise<void> {
  const { bearer } = this.options

  // Is the update query attempting to change role?
  const setRole = this._update?.$set?.role

  if (setRole) {
    const manageUsersAccessLevel = 500
    // If the bearer doesn't have proper privileges, don't allow this operation
    if (!bearer || !bearer.accessLevel || bearer.accessLevel < manageUsersAccessLevel) {
      const role = bearer?.role ?? "unknown"
      return next(new Error(`Can not edit roles as ${role}`))
    } else {
      // If allowed, also set the user's accessLevel to match role
      this._update.$set.accessLevel = userRolesMap[setRole as UserRoles] || 0
    }
  }

  next()
}

/**
 * Mongoose middleware to prevent role escalation
 * Allows for admins to be set via settings 'factor.roles[email]`
 * or via .env - FACTOR_ADMINS
 * @param this - the user document
 * @param next - next function (mongoose)
 *
 * @library mongoose
 */
const validateUserRoles = async function(
  this: FactorUserRoles & Document,
  next: HookNextFunction
): Promise<void> {
  let configRole = UserRoles.Member

  if (this.emailVerified || process.env.NODE_ENV == "development") {
    const envAdmins = process.env.FACTOR_ADMINS
    const admins = envAdmins ? envAdmins.split(",") : setting(`admins`)
    const adminUserEmail = admins.find((email: string) => this.email == email.trim())

    const settingRole = setting(`roles.${this.email}`)

    if (adminUserEmail) {
      configRole = UserRoles.Admin
    } else if (settingRole) {
      configRole = settingRole
    }
  }

  if (configRole != this.role) {
    this.role = configRole
  } else if (this.isModified("role") && configRole != this.role) {
    return next(new Error(`Can't edit user role to ${this.role}`))
  }

  this.accessLevel = userRolesMap[this.role as UserRoles] || 0

  next()
}

export const setup = (): void => {
  const key = "userRoles"

  /**
   * Add new fields to the user post type schema
   */
  addFilter({
    key,
    hook: "user-schema",
    callback: (_: SchemaDefinition): SchemaDefinition => {
      _.role = {
        type: String,
        enum: Object.keys(userRolesMap),
        required: true,
        default: "member"
      }

      _.accessLevel = {
        type: Number,
        min: 0,
        max: 1000,
        required: true,
        default: 0,
        index: true
      }

      return _
    }
  })

  /**
   * Add role property to user schema
   * Create a virtual accessLevel property based on role
   */
  addFilter({
    key,
    hook: "user-schema-hooks",
    callback: (userSchema: Schema) => {
      userSchema.pre("validate", validateUserRoles)
      userSchema.pre("update", validateUpdateManyQuery)
    }
  })

  /**
   * CLI admin setup utility for adding user roles to config
   */
  addFilter({
    key,
    hook: "cli-add-setup",
    callback: (_: SetupCliConfig[]) => {
      const setupAdmins: SetupCliConfig = {
        name: "User Roles - Add admin privileges to specific users.",
        value: "admins",
        callback: async (): Promise<void> => {
          const roles = userRolesMap
          const choices = Object.keys(roles).map(_ => {
            return {
              name: `${_} (${roles[_ as UserRoles]})`,
              value: _
            }
          })

          const questions = [
            {
              name: "email",
              message: "What's the user's email?",
              type: "input",
              validate: (v: string): string | boolean => {
                const re = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\d-AZa-z-]+\.)+[A-Za-z]{2,}))$/
                return re.test(v) ? true : "Enter a valid email address"
              }
            },
            {
              name: "role",
              message: "What is the role for this admin?",
              choices,
              type: "list"
            },
            {
              type: "confirm",
              name: `askAgain`,
              message: `Got it. Add another user?`,
              default: false
            }
          ]

          const admins: Record<string, string> = {}
          const ask = async (): Promise<void> => {
            const { askAgain, email, role } = await inquirer.prompt(questions)
            admins[email] = role
            if (askAgain) await ask()
          }

          await ask()

          await writeConfig("public", { roles: admins })
        }
      }

      return [..._, setupAdmins]
    }
  })
}

setup()
