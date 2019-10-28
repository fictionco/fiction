export default Factor => {
  return new (class {
    constructor() {}

    roles() {
      return require("./roles.json")
    }
  })()
}
