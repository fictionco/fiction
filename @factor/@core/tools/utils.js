export default Factor => {
  return new (class {
    constructor() {}

    sortMerge(arr) {
      return this.deepMerge(this.sortPriority(arr))
    }
    // Deep merge an array of objects into a single object
    // Replaces arrays instead of concats
    deepMerge(items) {
      return require("deepmerge").all(items.filter(_ => _), {
        arrayMerge: (destinationArray, sourceArray, options) => sourceArray
      })
    }

    // Parse settings using dot notation
    // TODO unit test this
    // Cases: [port] [app.name] [roles.arpowers@gmail.com]
    dotSetting({ key, settings }) {
      const currentKey = key.slice(0, key.indexOf("."))
      const subKeys = key.slice(key.indexOf(".") + 1)

      if (typeof settings[key] !== "undefined") {
        return settings[key]
      } else if (typeof settings[currentKey] == "object") {
        return this.dotSetting({ key: subKeys, settings: settings[currentKey] })
      } else {
        return undefined
      }
    }

    // Parse to standard utility lists
    // Ideal for passing around config data and lists (inputs, etc.. )
    parseList(list = [], options = {}) {
      let { suffix = "", prefix = "" } = options

      if (!Array.isArray(list)) {
        return []
      }

      const wrap = text => {
        const _ = []
        if (suffix) _.push(suffix)
        _.push(this.toLabel(text))
        if (prefix) _.push(prefix)
        return _.join(" ")
      }
      suffix = suffix ? " " + suffix : ""

      return list.map(_ => {
        if (typeof _ == "string" || typeof i == "number") {
          return {
            value: _,
            name: wrap(_),
            desc: ""
          }
        } else if (typeof _ == "object") {
          const { name, value } = _
          if (!name && value) {
            _.name = wrap(_)
          } else if (typeof value == "undefined" && name) {
            _.value = this.slugify(name)
          }
          return _
        } else {
          return false
        }
      })
    }

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
      return !string ? string : string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    }

    stopWordLowercase(str) {
      const words = str.split(" ")

      if (words.length <= 1) return str

      const stopwords = require("./resource/stopwords")

      const regex = new RegExp("\\b(" + stopwords.join("|") + ")\\b", "gi")
      return str.replace(regex, match => match.toLowerCase())
    }

    sortPriority(arr) {
      if (!arr || arr.length == 0) return arr

      return arr.sort((a, b) => {
        const ap = a.priority || 100
        const bp = b.priority || 100

        return ap < bp ? -1 : (ap > bp ? 1 : 0)
      })
    }

    excerpt(content, { length = 42 } = {}) {
      if (!content) {
        return ""
      }
      let splitContent = Factor.$markdown
        .strip(content)
        .replace(/\n|\r/g, " ")
        .split(" ")

      let excerpt

      if (splitContent.length > length) {
        splitContent = splitContent.slice(0, length)
        excerpt = splitContent.join(" ") + "..."
      } else {
        excerpt = splitContent.join(" ")
      }

      return excerpt
    }

    toPascalCase(string) {
      return `${string}`
        .replace(new RegExp(/[-_]+/, "g"), " ")
        .replace(new RegExp(/[^\w\s]/, "g"), "")
        .replace(
          new RegExp(/\s+(.)(\w+)/, "g"),
          ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, "g"), "")
        .replace(new RegExp(/\w/), s => s.toUpperCase())
    }
  })()
}
