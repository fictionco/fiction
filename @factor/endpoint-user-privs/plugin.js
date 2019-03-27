const { resolve } = require("path")

module.exports.default = Factor => {
  return new class {
    constructor() {
      this.adminService = require("firebase-admin")

      this.possibleRoles = require(`@factor/plugin-user/config.json`).roles

      this.UserRolesServiceSet = Factor.$filters.apply("user-role-service-set")
      this.UserRolesServiceGet = Factor.$filters.apply("user-role-service-get")
    }

    logger(text) {
      return `[customClaims Endpoint] ${text}`
    }

    async apply() {
      // Privs are what have been set up
      // Claims are set by us and used to set privs

      const user = Factor.$headers.auth

      if (!user) {
        throw new Error(this.logger("User not authenticated"))
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
      const existingPrivs = await this.UserRolesServiceGet({ uid, roles: this.possibleRoles })

      let needsToSetNewRole = Object.keys(userPrivs).some(key => {
        if (userPrivs[key] != existingPrivs[key]) {
          return true
        }
      })

      let out = { userPrivs, user, refresh: false, status: "normal" }
      if (needsToSetNewRole) {
        await this.UserRolesServiceSet({ uid, claims: userPrivs })
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
        const adminsFile = require(resolve(Factor.$paths.get("config"), "admins"))
        const setRole = adminsFile[email]
        if (setRole) {
          manualRole[setRole] = true
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
  }()
}
