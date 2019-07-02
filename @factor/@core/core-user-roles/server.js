module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("user-schema", _ => {
        _.role = {
          type: String,
          enum: Object.keys(this.roles())
        }

        return _
      })

      Factor.$filters.add("user-schema-hooks", Schema => {
        const _this = this

        Schema.virtual("accessLevel").get(function() {
          return this.role ? _this.roles()[this.role] : 0
        })
      })
    }

    roles() {
      return {
        owner: 1000,
        developer: 600,
        admin: 500,
        moderator: 400,
        publisher: 300,
        editor: 200,
        author: 100,
        contributor: 50,
        subscriber: 20,
        member: 1,
        visitor: 0
      }
    }
  })()
}
