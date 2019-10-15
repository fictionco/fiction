import Factor from "@factor/core"

// Sort objects in an array by a priority value that defaults to 100
export function sortPriority(arr) {
  if (!arr || arr.length == 0) return arr

  return arr.sort((a, b) => {
    const ap = a.priority || 100
    const bp = b.priority || 100

    return ap < bp ? -1 : (ap > bp ? 1 : 0)
  })
}

// Parse settings using dot notation
// TODO unit test this
// Cases: [port] [app.name] [roles.arpowers@gmail.com]
export function dotSetting({ key, settings }) {
  const currentKey = key.slice(0, key.indexOf("."))
  const subKeys = key.slice(key.indexOf(".") + 1)

  if (typeof settings[key] !== "undefined") {
    return settings[key]
  } else if (typeof settings[currentKey] == "object") {
    return dotSetting({ key: subKeys, settings: settings[currentKey] })
  } else {
    return undefined
  }
}

export function sortMerge(arr) {
  return deepMerge(sortPriority(arr))
}

// Deep merge an array of objects into a single object
// Replaces arrays instead of concats
export function deepMerge(items) {
  return require("deepmerge").all(items.filter(_ => _), {
    arrayMerge: (destinationArray, sourceArray, options) => sourceArray
  })
}

// Parse to standard utility lists
// Ideal for passing around config data and lists (inputs, etc.. )
export function parseList(list = [], options = {}) {
  let { suffix = "", prefix = "" } = options

  if (!Array.isArray(list)) return []

  const wrap = text => {
    const _ = []
    if (suffix) _.push(suffix)
    _.push(toLabel(text))
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
      if (!name && value) _.name = wrap(_)
      else if (typeof value == "undefined" && name) _.value = slugify(name)
      return _
    } else {
      return false
    }
  })
}

// Converts regular space delimitted text into a hyphenated slug
export function slugify(text) {
  if (!text) return text

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

// Coverts a slug or variable into a title-like string
export function toLabel(str) {
  if (!str || typeof str !== "string") return str

  let label = camelToKebab(str)
    .replace(new RegExp("-|_", "g"), " ")
    .replace(/\b\w/g, l => l.toUpperCase())

  return stopWordLowercase(label)
}

// Convert camel-case to kebab-case
export function camelToKebab(string) {
  return !string ? string : string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

// Make stop words lower case in a title
export function stopWordLowercase(str) {
  const words = str.split(" ")

  if (words.length <= 1) return str

  const stopwords = require("./resource/stopwords")

  const regex = new RegExp("\\b(" + stopwords.join("|") + ")\\b", "gi")
  return str.replace(regex, match => match.toLowerCase())
}

export function excerpt(content, { length = 42 } = {}) {
  if (!content) return ""

  let __ = Factor.$markdown
    .strip(content)
    .replace(/\n|\r/g, " ")
    .split(" ")

  return __.length > length ? __.slice(0, length).join(" ") + "..." : __.join(" ")
}

export function toPascalCase(string) {
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
