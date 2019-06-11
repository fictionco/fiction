module.exports.default = Factor => {
  return new (class {
    constructor() {
      require(".").default(Factor)
    }
  })()
}
