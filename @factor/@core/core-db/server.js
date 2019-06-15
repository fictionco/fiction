module.exports.default = Factor => {
  return new (class {
    constructor() {}

    async run(params) {
      return await Factor.$stack.service(`db-service-server`, params)
    }
  })()
}
