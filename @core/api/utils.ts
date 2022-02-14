import deepMergeUtility from "deepmerge"
import stableStringify from "fast-json-stable-stringify"
import md5 from "spark-md5"
import { customAlphabet } from "nanoid"
import { ListItem, PriorityItem } from "@factor/types"
import stopwordsLib from "./resource/stopwords"

/**
 * Are we in Node or browser?
 */
export const isNode =
  typeof process !== "undefined" && process.versions && process.versions.node
    ? true
    : false
/**
 * Are we in development mode?
 */
export const isDev = (): boolean => {
  return process.env.NODE_ENV == "development" ? true : false
}
/**
 * Stringify and hash
 * https://github.com/joliss/fast-js-hash-benchmark
 */
export const fastHash = (
  data: Record<string, any> | any[] | string | number,
): string => {
  return md5.hash(stableStringify(data)).toString()
}
/**
 * Standard format globally unique ID
 */
export const uuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.trunc(Math.random() * 16),
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
/**
 * Gets a short ID consisting only of lowercase letters
 * @note
 *  - needed in DB, lowercase only means it's immune to transforms of case (snake_case to camelCase)
 */
export const shortId = (): string => {
  return customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10)()
}
/**
 * Get a universal global this object
 */
export const getGlobalThis = (): any => {
  return typeof window != "undefined" ? window : global
}

/**
 * Detect if visitor is actually a search bot
 */
export const isSearchBot = (): boolean => {
  if (!window || !window.navigator) {
    return false
  }
  const result =
    /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(
      window.navigator.userAgent,
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
  fullName?: string,
): { firstName: string; lastName: string } => {
  const nameArray = fullName ? fullName.split(" ") : []

  let firstName = ""
  let lastName = ""
  if (nameArray.length > 0) {
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

export const objectId = (idLength = 16): string => {
  const nts = (s: number): string => Math.floor(s).toString(idLength)
  return (
    nts(Date.now() / 1000) +
    " ".repeat(idLength).replace(/./g, () => nts(Math.random() * idLength))
  )
}
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
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
export const sortPriority = <T extends { priority?: number }[]>(arr: T): T => {
  if (!arr || arr.length === 0) return arr

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
export const dotSetting = <T = unknown>({
  key,
  settings,
}: {
  key: string
  settings: Record<string, any>
}): T | undefined => {
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
 */
export const deepMerge = <T extends Record<string, any>>(
  items: (T | Partial<T> | undefined)[],
  options: { mergeArrays?: boolean } = {},
): T => {
  const mergeItems = items.filter((_) => _) as T[]

  const merged: T = deepMergeUtility.all(mergeItems, {
    arrayMerge: (lowerPriority: unknown[], higherPriority: unknown[]) => {
      if (options.mergeArrays) {
        return [...higherPriority, ...lowerPriority]
      }
      return higherPriority
    },
  }) as T

  return merged
}
/**
 * merges all and concatenates arrays
 */
export const deepMergeAll = <T>(items: (Partial<T> | undefined)[]): T => {
  const i = items.filter((_) => _) as T[]
  return deepMerge<T>(i, { mergeArrays: true })
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
  if (lib.length === 0) {
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
  return !string
    ? string
    : string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * Coverts a slug or variable into a title-like string
 */
export const toLabel = (str?: string): string => {
  if (!str || typeof str !== "string") return ""

  const label = camelToKebab(str)
    .replace(new RegExp("-|_", "g"), " ") // turn dashes to spaces
    .replace(/\//g, " ") // remove slashes and special chars
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim()

  return stopWordLowercase(label, ["and", "an", "a", "the", "or", "am", "to"])
}

/**
 * Converts regular space delimited text into a hyphenated slug
 */
export const slugify = (text?: string): string | undefined => {
  if (!text) return text

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/^\d+/g, "") // Remove Numbers
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/(\?|:)/g, "") // remove colons and question marks
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}
/**
 * Turns a PascaleCase or camelCase into snake_case
 */
export const snakeCase = (text: string): string => {
  return text.replace(/([A-Z])/g, "_$1").toLowerCase()
}
/**
 * Turn a string into camelCase
 */
export const camelize = (str?: string): string => {
  if (!str) return ""

  return str
    .replace(/^\w|[A-Z]|\b\w/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s|-/g, "")
}

/**
 * Returns object keys in snake_case
 */
export const snakeCaseKeys = (
  original: Record<string, any>,
): Record<string, any> => {
  const newObject: Record<string, any> = {}
  for (const camel in original) {
    newObject[snakeCase(camel)] = original[camel]
  }
  return newObject
}
/**
 * Parse to standard utility lists
 * Standard format for passing around config data and lists (inputs, etc.. )
 */
export const normalizeList = (
  list: (string | Partial<ListItem>)[] = [],
  options: { prefix?: string; suffix?: string } = {},
): ListItem[] => {
  const { prefix = "" } = options
  let { suffix = "" } = options

  if (!Array.isArray(list)) return []

  suffix = suffix ? " " + suffix : ""

  const normalized: ListItem[] = list.map((_) => {
    if (typeof _ == "string" || typeof _ == "number") {
      const label = `${prefix}${toLabel(_)}${suffix}`
      return {
        value: _,
        name: label,
        desc: "",
      }
    } else {
      let { name, value } = _

      if (!name && value) {
        name = `${prefix}${toLabel(value)}${suffix}`
      } else if (typeof value == "undefined" && name) {
        value = slugify(name) || ""
      }
      if (!name) name = ""
      if (!value) value = ""

      return { ..._, name, value }
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
export const toPascalCase = (text: string): string => {
  return `${text}`
    .replace(new RegExp(/[_-]+/, "g"), " ")
    .replace(new RegExp(/[^\s\w]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w+)/, "g"),
      ($1, $2: string, $3: string) => `${$2.toUpperCase() + $3.toLowerCase()}`,
    )
    .replace(new RegExp(/\s/, "g"), "")
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}
/**
 * Validate an email address
 * @reference
 * https://stackoverflow.com/a/46181/1858322
 */
export const validateEmail = (email?: string): boolean => {
  if (!email) return false
  const re =
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
/**
 * Normalize Domain for display
 */
export const displayDomain = (url?: string): string => {
  if (!url) {
    return ""
  }
  // remove protocol, make www and naked the same, and remove slashes on start or end
  return url
    .replace(/^https?:\/\//, "")
    .replace("www.", "")
    .replace(/\/$/, "")
}

/**
 * Gets a favicon image based on a URL
 * @depends on DuckDuckGo Favicon URL
 */
export const getFavicon = (url: string | undefined): string => {
  let hostname: string

  if (!url) return ""

  if (!url.includes("http")) {
    url = `http://${url}`
  }

  if (!url) {
    hostname = ""
  } else {
    const _url = new URL(url)

    hostname = _url.hostname
  }

  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`
}

export const capitalize = (s?: string): string => {
  if (typeof s !== "string") return ""
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const urlPath = (...parts: string[]): string => {
  const separator = "/"
  parts = parts.map((part, index) => {
    if (index) {
      part = part.replace(new RegExp("^" + separator), "")
    }
    if (index !== parts.length - 1) {
      part = part.replace(new RegExp(separator + "$"), "")
    }
    return part
  })
  return parts.join(separator).replace(/\/+$/, "")
}

export const isValidJson = (str?: string): undefined | unknown => {
  if (!str) return undefined
  try {
    const r = JSON.parse(str) as unknown
    return r
  } catch {
    return undefined
  }
}

/**
 * In an iFrame?
 * https://stackoverflow.com/a/326076/1858322
 */
export const inIFrame = (): boolean => {
  if (isNode) return false
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}
/**
 * group array into elements by key
 */
export const groupBy = <
  T extends Record<string, any[]> = Record<string, any[]>,
>(
  items: any[],
  key: string,
): T => {
  // eslint-disable-next-line unicorn/prefer-object-from-entries, @typescript-eslint/no-unsafe-return
  return items.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (result, item) => ({
      ...result,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/no-unsafe-assignment
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  )
}
