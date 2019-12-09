import { addFilter, setting } from "@factor/api"
import { writeConfig, SetupCliConfig } from "@factor/cli/setup"
import inquirer from "inquirer"
import { Schema, SchemaDefinition, HookNextFunction, Document } from "mongoose"
import { FactorUser, userRolesMap, UserRoles } from "./types"

interface FactorUserRoles extends FactorUser {
  role: string;
  accessLevel: number;
}

export const setup = (): void => {
  const key = "userRoles"
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

  // Add role property to user schema
  // Create a virtual accessLevel property based on role
  addFilter({
    key,
    hook: "user-schema-hooks",
    callback: (_s: Schema) => {
      _s.pre("validate", async function(
        this: FactorUserRoles & Document,
        next: HookNextFunction
      ) {
        const existing = setting(`roles.${this.email}`)
        const configRole = this.emailVerified && existing ? existing : UserRoles.Member

        if (configRole != this.role) {
          this.role = configRole
        } else if (this.isModified("role") && configRole != this.role) {
          return next(new Error(`Can not edit role ${this.role}`))
        }

        this.accessLevel = userRolesMap[this.role as UserRoles] || 0

        return next()
      })
    }
  })

  // CLI admin setup utility
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
                const re = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\d-A-Za-z]+\.)+[A-Za-z]{2,}))$/
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

          await writeConfig("factor-config", { roles: admins })
        }
      }

      return [..._, setupAdmins]
    }
  })
}

setup()
