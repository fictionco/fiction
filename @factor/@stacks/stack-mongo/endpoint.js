module.exports.default = Factor => {
  return new (class {
    constructor() {}

    testMethod(params) {
      return { text: "this worked", params }
    }
  })()
}
