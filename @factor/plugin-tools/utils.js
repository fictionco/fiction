module.exports.default = Factor => {
  return new class {
    constructor() {}

    toLabel(str) {
      if (!str || typeof str !== "string") {
        return str
      }
      let label = this.camelToKebab(str)
        .replace(new RegExp("-|_", "g"), " ")
        .replace(/\b\w/g, l => l.toUpperCase())

      return this.stopWordLowercase(label)
    }

    camelToKebab(string) {
      if (!string) {
        return string
      } else {
        return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
      }
    }

    stopWordLowercase(str) {
      const stopwords = require("stopwords").english

      const regex = new RegExp("\\b(" + stopwords.join("|") + ")\\b", "gi")
      return str.replace(regex, match => {
        return match.toLowerCase()
      })
    }
  }()
}
