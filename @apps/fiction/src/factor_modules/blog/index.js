module.exports.default = Factor => {
  return new (class {
    constructor() {
      console.log("load me")
    }
  })()
}
