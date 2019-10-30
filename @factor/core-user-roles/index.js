export default () => {
  return new (class {
    roles() {
      return require("./roles.json")
    }
  })()
}
