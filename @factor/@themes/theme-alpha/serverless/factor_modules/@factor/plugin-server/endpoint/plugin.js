module.exports.default = Factor => {
  return new class {
    constructor() {}

    requestHandler(req, res) {
      return require("@factor/plugin-server").server()
    }
  }()
}
