module.exports.default = Factor => {
  return new (class {
    constructor() {
      // Add role property to user schema
      Factor.$filters.add("user-schema", _ => {
        _.role = {
          type: String,
          enum: Object.keys(this.roles()),
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
      })

      // Create a virtual accessLevel property based on role
      Factor.$filters.add("user-schema-hooks", Schema => {
        const _this = this

        // Schema.virtual("accessLevel").get(function() {
        //   return this.role ? _this.roles()[this.role] : 0
        // })

        Schema.pre("validate", async function (next) {
          const user = this
          const setting = Factor.$config.setting(`roles.${user.email}`)
          const configRole = user.emailVerified && setting ? setting : "member"

          if (configRole && configRole != user.role) {
            user.role = configRole
          } else if (user.isModified("role") && configRole != user.role) {
            return next(new Error(`Can not edit role ${user.role}`))
          }

          user.accessLevel = _this.roles()[user.role] || 0

          return next()
        })
      })

      // CLI admin setup utility
      Factor.$filters.add("cli-add-setup", _ => {
        const setupAdmins = {
          name: "Admins - Add new admin users",
          value: "admins",
          callback: async ({ program, inquirer }) => {
            const choices = Object.keys(this.possibleRoles).map(_ => {
              return {
                name: `${_} (${this.possibleRoles[_]})`,
                value: _
              }
            })

            const questions = [
              {
                name: "email",
                message: "What's the user's email?",
                type: "input",
                validate: v => {
                  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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

            let admins = []
            const ask = async () => {
              let { askAgain, ...answers } = await inquirer.prompt(questions)
              admins.push({ ...answers })
              if (askAgain) {
                await ask()
              }
            }

            await ask()

            let write = { public: { config: { admins } } }

            return write
          }
        }

        return [..._, setupAdmins]
      })
    }

    roles() {
      return require("./roles.json")
    }
  })()
}
