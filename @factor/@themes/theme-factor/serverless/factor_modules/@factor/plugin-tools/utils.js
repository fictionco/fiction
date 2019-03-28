module.exports.default = Factor => {
  return new class {
    constructor() {}

    slugify(text) {
      if (!text) {
        return text
      }

      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/^\d+/g, "") // Remove Numbers
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, "") // Trim - from end of text
    }

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
