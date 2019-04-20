export default Factor => {
  return new (class {
    constructor() {
      const { resolve } = require("path")
      Factor.$filters.add("prepended-style-var-files", _ => {
        _.push(resolve(__dirname, "style-vars*"))

        if (Factor.$paths.get("theme")) {
          _.push(resolve(Factor.$paths.get("theme"), "**/style-vars*"))
        }

        _.push(resolve(Factor.$paths.get("source"), "**/style-vars*"))
        return _
      })
    }
  })()
}
