module.exports.default = Factor => {
  return new class {
    constructor() {
      this.adminService = require("firebase-admin")

      this.roles = require(`@factor/plugin-user/config.json`).roles
    }

    async customClaims() {
      // Privs are what have been set up
      // Claims are set by us and used to set privs

      const user = Factor.$user
      const uid = Factor.$uid

      const { role = {} } = user

      const privs = await this.getExistingClaims(uid)

      let newClaims = { accessLevel: 1 }

      Object.keys(this.roles).forEach(r => {
        const roleAccessLevel = this.roles[r]
        const assignedRole = role[r]
        if (assignedRole) {
          newClaims[r] = assignedRole

          if (roleAccessLevel > newClaims.accessLevel) {
            newClaims.accessLevel = roleAccessLevel
            newClaims.accessTitle = r
          }
        }
      })

      let setNewClaims = Object.keys(newClaims).some(key => {
        if (newClaims[key] != privs[key]) {
          return true
        }
      })

      let out = {}
      if (setNewClaims) {
        try {
          await this.setNewClaims(uid, newClaims)
          out = { status: "new", refresh: true, newClaims, privs, uid }
        } catch (error) {
          throw new Error(error)
        }
      } else {
        out = {
          status: "normal",
          refresh: false
        }
      }

      return out
    }

    async getExistingClaims(uid) {
      const privs = {}

      // Lookup the user associated with the specified uid.
      const userRecord = await this.adminService.auth().getUser(uid)

      if (userRecord && userRecord.customClaims) {
        Object.keys(this.roles).forEach(fld => {
          if (userRecord.customClaims[fld]) {
            privs[fld] = userRecord.customClaims[fld]
          }
        })
      }

      return privs
    }

    async setClaims(uid, claims) {
      await this.adminService.auth().setCustomUserClaims(uid, claims)
      return claims
    }
  }()
}
