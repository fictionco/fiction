import deepMergeLib from "deepmerge"
import randToken from "rand-token"
import isNode from "detect-node"
import guid from "uniqid"
import Vue from "vue"
import stopwordsLib from "./resource/stopwords"

export * from "./utils-lodash"

export { isNode, guid }

/**
 * Global "this" value object that gets reset on server restart
 * but not when a module is refreshed (out of module scope)
 *
 * Setting to Vue object for now, but may need tweak at vue3 upgrade
 */
export const appGlobal = Vue as Record<string, any>

/**
 * Standard list format
 */
export interface ListItem {
  value?: string
  name?: string
  label?: string
  desc?: string
}

/**
 * Object with a priority key for sorting
 */
export interface PriorityItem {
  priority?: number
  [key: string]: any
}

/**
 * Get a universal global this object
 */
export const appThis = (): typeof globalThis | NodeJS.Global => {
  if (globalThis) {
    return globalThis
  } else {
    return isNode ? global : window
  }
}

/**
 * Detect if visitor is actually a search bot
 */
export const isSearchBot = (): boolean => {
  if (!window || !window.navigator) {
    return false
  }
  const result = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(
    window.navigator.userAgent
  )

  return result
}

/**
 * Wait for specific amount of time
 * @param ms - milliseconds
 */
export const waitFor = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms || 0))
}

/**
 * Turns a full name into firstName and lastName approx
 * @param fullName - a full name
 */
export const splitDisplayName = (
  fullName?: string
): { firstName: string; lastName: string } => {
  const nameArray = fullName ? fullName.split(" ") : []

  let firstName = ""
  let lastName = ""
  if (nameArray.length >= 1) {
    firstName = nameArray[0]
  }

  if (nameArray.length > 1) {
    const lastItem = nameArray.pop()
    lastName = lastItem ? lastItem : ""
  }

  return { firstName, lastName }
}

/**
 * Returns a global process based working directory if argument cwd is undefined
 * @param cwd - working directory
 */
export const getWorkingDirectory = (cwd?: string): string => {
  return cwd ? cwd : process.env.FACTOR_CWD || process.cwd()
}

/**
 * Generates a random token string, 16 characters long
 */
export const randomToken = (length = 16): string => {
  return randToken.generate(length)
}

/**
 * Ensure there is a slash at end of string
 * @param path
 */
export const ensureTrailingSlash = (path: string): string => {
  path += path.endsWith("/") ? "" : "/"
  return path
}

// Sort objects in an array by a priority value that defaults to 100
export const sortPriority = <TPri extends PriorityItem[]>(arr: TPri): TPri => {
  if (!arr || arr.length == 0) return arr

  return arr.sort((a, b) => {
    const ap = a.priority || 100
    const bp = b.priority || 100

    let result = 0

    if (ap < bp) {
      result = -1
    } else if (ap > bp) {
      result = 1
    }

    return result
  })
}
/**
 * Parse settings using dot notation
 * @param key - dot.notation pointer to settings
 * @param settings - object - all settings object
 * @remarks
 * Cases: [port] [app.name] [roles.arpowers@gmail.com]
 */
export const dotSetting = ({
  key,
  settings,
}: {
  key: string
  settings: Record<string, any>
}): any => {
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

/**
 * Deep merge an array of objects into a single object
 *
 * @remarks
 * If two settings are arrays, then we have a special merge strategy
 * If the lower priority array has objects with _item or _ attribute,
 * then we merge with the higher priority array if it has object w same _item or _
 *
 * @param items - array of objects
 */
export const deepMerge = <T>(
  items: Partial<T>[],
  options: { mergeArrays?: boolean } = {}
): Record<string, any> => {
  const mergeItems = items.filter((_) => _)

  const merged = deepMergeLib.all(mergeItems, {
    arrayMerge: (lowerPriority, higherPriority) => {
      if (options.mergeArrays) {
        return [...higherPriority, ...lowerPriority]
      }
      return higherPriority.map((higher: any) => {
        if (higher === null || typeof higher !== "object") {
          return higher
        }

        const matchingObject = lowerPriority.find((lower: any) => {
          if (lower === null || typeof lower !== "object") {
            return false
          } else if (lower._item && higher._item && lower._item == higher._item) {
            return true
          } else if (lower._key && higher._key && lower._key == higher._key) {
            return true
          } else {
            return false
          }
        })

        if (matchingObject) {
          return deepMerge([matchingObject, higher])
        } else {
          return higher
        }
      })
    },
  })

  return merged
}

/**
 * Merges an array of objects, but first sorts them by priority attr
 * @param arr - array of objects w priority key
 */
export const sortMerge = (arr: PriorityItem[]): Record<string, any> => {
  return deepMerge(sortPriority(arr))
}

/**
 * Make stop words lower case in a title
 * @param str - string to manipulate
 * @param lib - stopwords array
 */
export const stopWordLowercase = (str: string, lib: string[] = []): string => {
  if (lib.length == 0) {
    lib = stopwordsLib
  }

  const words = str.split(" ")

  if (words.length <= 1) return str

  const regex = new RegExp("\\b(" + lib.join("|") + ")\\b", "gi")

  return str.replace(regex, (match) => match.toLowerCase())
}

export const camelToUpperSnake = (string: string): string => {
  return string
    .replace(/\w([A-Z])/g, function (m) {
      return m[0] + "_" + m[1]
    })
    .toUpperCase()
}
/**
 * Convert camel-case to kebab-case
 * @param string - string to manipulate
 */
export const camelToKebab = (string: string): string => {
  return !string ? string : string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * Coverts a slug or variable into a title-like string
 * @param str - slug to make into label
 */
export const toLabel = (str?: string): string => {
  if (!str || typeof str !== "string") return ""

  const label = camelToKebab(str)
    .replace(new RegExp("-|_", "g"), " ") // turn dashes to spaces
    .replace(/\//g, " ") // remove slashes and special chars
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim()

  return stopWordLowercase(label, ["and", "an", "a", "the", "or", "am"])
}

/**
 * Converts regular space delimited text into a hyphenated slug
 * @param text - string to manipulate
 */
export const slugify = (text?: string): string | undefined => {
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

/**
 * Converts a nested object to a normalized env friendly config
 */
type SettingObject = Record<string, Record<string, any> | string | string[]>
export const envKeys = (
  settingsObject: SettingObject,
  prefix = "FACTOR"
): Record<string, string> => {
  let out: Record<string, string> = {}

  Object.keys(settingsObject).forEach((key) => {
    const val = settingsObject[key]
    const envKey = [prefix, camelToUpperSnake(key)].join("_")
    if (Array.isArray(val)) {
      out[envKey] = val.filter((_) => typeof _ == "string").join(",")
    } else if (val && typeof val == "object" && val != null) {
      const keys = envKeys(val as SettingObject, envKey)
      out = { ...out, ...keys }
    } else {
      out[envKey] = val
    }
  })
  return out
}

export const findListItem = (value: string, list: ListItem[]): ListItem => {
  const def = { value, name: toLabel(value), desc: "" }

  const found = list.find((_: ListItem) => _.value == value) ?? {}

  return { ...def, ...found }
}
/**
 * Parse to standard utility lists
 * Standard format for passing around config data and lists (inputs, etc.. )
 * @param list - list to normalize
 * @param options - options for list output
 */
export const parseList = (
  list: ListItem[] = [],
  options: { prefix?: string; suffix?: string } = {}
): ListItem[] => {
  const { prefix = "" } = options
  let { suffix = "" } = options

  if (!Array.isArray(list)) return []

  suffix = suffix ? " " + suffix : ""

  const normalized = list.map((_) => {
    if (typeof _ == "string" || typeof _ == "number") {
      const label = `${prefix}${toLabel(_)}${suffix}`
      return {
        value: _,
        name: label,
        label,
        desc: "",
      }
    } else {
      const { name, label, value } = _
      if (!name && label) {
        _.name = label
      } else if (!label && name) {
        _.label = name
      }
      if (!_.label && value) {
        const label = `${prefix}${toLabel(value)}${suffix}`
        _.name = label
        _.label = label
      } else if (typeof value == "undefined" && _.label) {
        _.value = slugify(_.label)
      }
      return _
    }
  })
  return normalized
}

/**
 * Converts a string ToPascalCase
 * @param string - string to manipulate
 *
 * @remarks
 * http://wiki.c2.com/?PascalCase
 */
export const toPascalCase = (string: string): string => {
  return `${string}`
    .replace(new RegExp(/[_-]+/, "g"), " ")
    .replace(new RegExp(/[^\s\w]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w+)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, "g"), "")
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}
