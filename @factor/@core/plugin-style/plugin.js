export default Factor => {
  return new class {
    constructor() {
      const { resolve } = require("path")
      Factor.$filters.add("prepended-style-var-files", _ => {
        _.push(resolve(__dirname, "style-vars*"))
        _.push(resolve(Factor.$paths.get("theme"), "**/style-vars*"))
        _.push(resolve(Factor.$paths.get("app"), "**/style-vars*"))
        return _
      })
    }
  }()
}
