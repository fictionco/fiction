module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.possibleRoles = require("@factor/cms-user/config.json").roles

      Factor.$stack.register({
        id: "user-role-service-get",
        title: "User Role Getter",
        description: "Gets the existing roles and access level for user.",
        args: "Object {uid, roles (possible)}",
        returns: "Object {role (admin|moderator): true, accessLevel: Number}"
      })

      Factor.$stack.register({
        id: "user-role-service-set",
        title: "User Role Setter",
        description: "Sets claims/role for user with auth service.",
        args: "Object { uid, claims: {admin: true} }",
        returns: "Object (New Claims)"
      })

      Factor.$filters.add("factor-setup-utility", _ => {
        const setupAdmins = {
          name: "Admins - Add new admin users",
          value: "admins",
          callback: async inquirer => {
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
        _.push(setupAdmins)
        return _
      })
    }

    async apply() {
      // Privs are what have been set up
      // Claims are set by us and used to set privs

      const user = Factor.$headers.auth

      if (!user) {
        throw new Error("User Role EP: User not authenticated")
      }

      const { uid } = user

      // Figure out what privs *should* be
      const adminRole = await this.getUserAdminRoles(user)

      let userPrivs = { accessLevel: 1 }

      // Loop through possible roles
      // Give user the access level and title associated with their
      // highest authority role
      Object.keys(this.possibleRoles).forEach(role => {
        const roleAccessLevel = this.possibleRoles[role]
        const assignedRole = adminRole[role]
        if (typeof assignedRole != "undefined") {
          if (assignedRole) {
            userPrivs[role] = true

            if (roleAccessLevel > userPrivs.accessLevel) {
              userPrivs.accessLevel = roleAccessLevel
              userPrivs.accessTitle = role
            }
          } else {
            userPrivs[role] = false
          }
        }
      })

      // set service privs if needed
      const existingPrivs = await Factor.$stack.service("user-role-service-get", {
        uid,
        roles: this.possibleRoles
      })

      let needsToSetNewRole = Object.keys(userPrivs).some(key => {
        if (userPrivs[key] != existingPrivs[key]) {
          return true
        }
      })

      let out = { userPrivs, user, refresh: false, status: "normal" }
      if (needsToSetNewRole) {
        await Factor.$stack.service("user-role-service-set", { uid, claims: userPrivs })
        out.status = "new"
        out.refresh = true
      }

      return out
    }

    // Gets all user information private/public
    // Note that this information is accessible and viewable only by the server and not publicly shown
    async getUserAdminRoles(user) {
      const { uid, email, emailVerified } = user

      const manualRole = {}

      if (email && emailVerified) {
        const adminConfig = Factor.$config.setting("admins") || [] // require this way to avoid webpack warning (not running in webpack)
        const adm = adminConfig.find(_ => _.email == email)
        if (adm.role) {
          manualRole[adm.role] = true
        }
      }

      const userAdmin = await Factor.$db.read({
        collection: "admin",
        id: uid
      })

      const dbRole = userAdmin && userAdmin.role ? userAdmin.role : {}

      const setRoles = Object.assign({}, dbRole, manualRole)

      return setRoles
    }
  })()
}
