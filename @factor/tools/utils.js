import deepMergeLib from "deepmerge"
import stopwordsLib from "./resource/stopwords"

export function ensureTrailingSlash(path) {
  path += path.endsWith("/") ? "" : "/"
  return path
}
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
// Replaces arrays instead of concat
export function deepMerge(items) {
  return deepMergeLib.all(
    items.filter(_ => _),
    {
      arrayMerge: (destinationArray, sourceArray) => sourceArray
    }
  )
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
    if (typeof _ == "string" || typeof _ == "number") {
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

// Converts regular space delimited text into a hyphenated slug
export function slugify(text) {
  if (!text) return text

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/^\d+/g, "") // Remove Numbers
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

// Coverts a slug or variable into a title-like string
export function toLabel(str) {
  if (!str || typeof str !== "string") return str

  let label = camelToKebab(str)
    .replace(new RegExp("-|_", "g"), " ")
    .replace(/\b\w/g, l => l.toUpperCase())

  return stopWordLowercase(label, ["and", "an", "a", "the", "or", "am"])
}

// Convert camel-case to kebab-case
export function camelToKebab(string) {
  return !string ? string : string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

// Make stop words lower case in a title
export function stopWordLowercase(str, lib = []) {
  if (lib.length == 0) {
    lib = stopwordsLib
  }
  const words = str.split(" ")

  if (words.length <= 1) return str

  const regex = new RegExp("\\b(" + stopwordsLib.join("|") + ")\\b", "gi")
  return str.replace(regex, match => match.toLowerCase())
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

export function uniqueObjectHash(obj, salt = "") {
  if (!obj) return obj

  let str
  if (typeof obj == "string") {
    str = obj
  } else if (typeof obj == "function") {
    str = obj.toString()
  } else {
    // Make sure to remove circular refs
    // https://github.com/WebReflection/flatted#flatted
    const { stringify } = require("flatted/cjs")
    str = stringify(obj)
  }

  str = str + salt

  str = str.slice(0, 500)

  const keyed = str
    .split("")
    .reduce(
      (prevHash, currVal) => ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    )

  return String(keyed).replace(/-/g, "")
}
