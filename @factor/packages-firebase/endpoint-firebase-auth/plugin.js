module.exports.default = Factor => {
  return new class {
    constructor() {}

    async customClaims() {
      // Privs are what have been set up
      // Claims are set by us and used to set privs

      const user = Factor.$user
      const uid = Factor.$uid

      const { role = {} } = user

      const privs = await this.tools.getExistingClaims(uid)

      const roles = require(`@factor/plugin-user/config`).roles

      let newClaims = { accessLevel: 1 }

      Object.keys(roles).forEach(r => {
        const roleAccessLevel = roles[r]
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
          await this.tools.setNewClaims(uid, newClaims)
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
  }()
}
