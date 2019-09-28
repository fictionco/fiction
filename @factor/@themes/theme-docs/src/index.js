module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      this.addComponents()
    }

    addComponents() {}

    async addPaths() {}
  })()
}
