import path from 'node:path'
import stableStringify from 'fast-safe-stringify'
import md5 from 'spark-md5'

import { isPlainObject } from './obj'
import { isNode } from './vars'
import { toCamel } from './casing'

/**
 * Safely get the dirname with import.meta.url
 * This variable is undefined in SSR so needs to be checked
 */
export function safeDirname(url?: string, relativePath = ''): string {
  if (!url)
    return ''
  return path.join(new URL('.', url).pathname, relativePath)
}

export function randomBetween(min: number, max: number, decimalPlaces = 0): number {
  const rand = Math.random() * (max - min) + min
  const power = 10 ** decimalPlaces
  return Math.floor(rand * power) / power
}
export function stringify(data: unknown): string {
  return stableStringify(
    data,
    (_key, value): unknown => {
      if (value !== '[Circular]')
        return value as unknown
    },
    2,
  )
}
/**
 * Stringify and hash
 * https://github.com/joliss/fast-js-hash-benchmark
 */
type HashObject = Record<string, any> | any[] | string | number
export function fastHash(data: HashObject): string {
  return md5.hash(stableStringify(data)).toString()
}
/**
 * Use hash to determine if two objects are the same
 */
export function hashEqual(a?: HashObject, b?: HashObject): boolean {
  return fastHash(a || {}) === fastHash(b || {})
}

/**
 * Detect if visitor is actually a search bot
 */
export function isSearchBot(): boolean {
  if (typeof window === 'undefined' || !window.navigator)
    return false

  const result
    = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(
      window.navigator.userAgent,
    )

  return result
}
/**
 * Wait for specific amount of time
 * @param ms - milliseconds
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms || 0))
}
/**
 * Turns a full name into firstName and lastName approx
 * @param fullName - a full name
 */
export function splitDisplayName(fullName?: string): { firstName: string, lastName: string } {
  const nameArray = fullName ? fullName.split(' ') : []

  let firstName = ''
  let lastName = ''
  if (nameArray.length > 0)
    firstName = nameArray[0]

  if (nameArray.length > 1) {
    const lastItem = nameArray.pop()
    lastName = lastItem || ''
  }

  return { firstName, lastName }
}

export function camelToUpperSnake(string: string): string {
  return string
    .replaceAll(/\w([A-Z])/g, (m) => {
      return `${m[0]}_${m[1]}`
    })
    .toUpperCase()
}
/**
 * Turns a PascaleCase or camelCase into snake_case
 */
export function toSnakeCase(text: string): string {
  return text.replaceAll(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * Convert camel-case to kebab-case
 * @param string - string to manipulate
 */
export function camelToKebab(string: string): string {
  return string
    ? string.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    : string
}

// /**
//  * Turn a string into camelCase @todo .. doesn't work on snake_case
//  */
// export function toCamel(str?: string): string {
//   if (!str)
//     return ''

//   return str
//     // Replace first letter of each word (after a space, underscore, or hyphen) and the first letter of the string
//     .replace(/(?:^\w|[A-Z]|[\s_-]+\w)/g, (word, index) => {
//       // Convert to lowercase if it's the first character, otherwise to uppercase
//       return index === 0 ? word.toLowerCase() : word.slice(-1).toUpperCase()
//     })
//     // Remove all spaces, underscores, and hyphens
//     .replace(/[\s_-]/g, '')
// }
/**
 * Camelize keys in an object
 */
export const camelKeys = function <T>(obj: T): T {
  if (isPlainObject(obj) && !Array.isArray(obj)) {
    const n: Record<string, unknown> = {}
    const o = obj as Record<string, unknown>
    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = camelKeys(o[k])
    })

    return n as T
  }
  else if (Array.isArray(obj)) {
    const o = obj as unknown[]
    return o.map((i) => {
      return camelKeys(i)
    }) as T
  }

  return obj
}

/**
 * Returns object keys in snake_case
 */
export function toSnakeCaseKeys<T>(obj: T): T {
  if (isPlainObject(obj) && !Array.isArray(obj)) {
    const n: Record<string, unknown> = {}
    const o = obj as Record<string, unknown>
    Object.keys(o).forEach((k) => {
      n[toSnakeCase(k)] = toSnakeCaseKeys(o[k])
    })

    return n as T
  }
  else if (Array.isArray(obj)) {
    const o = obj as unknown[]
    return o.map((i) => {
      return toSnakeCaseKeys(i)
    }) as T
  }

  return obj
}

export function jsonToDbString(str: unknown): string {
  return JSON.stringify(toSnakeCaseKeys(str))
}

/**
 * Validate an email address
 * @reference
 * https://stackoverflow.com/a/46181/1858322
 */
export function validateEmail(email?: string): string | undefined {
  if (!email)
    return undefined
  const re = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}\])|(([\dA-Z-]+\.)+[A-Z]{2,}))$/i
  return re.test(String(email).toLowerCase()) ? email : undefined
}

export function capitalize(s?: string): string {
  if (typeof s !== 'string')
    return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function isJson<T = unknown>(str?: string): false | undefined | T {
  if (!str)
    return undefined
  try {
    const r = JSON.parse(str) as T
    return r
  }
  catch {
    return false
  }
}

/**
 * In an iFrame?
 * https://stackoverflow.com/a/326076/1858322
 */
export function inIFrame(): boolean {
  if (isNode())
    return false
  try {
    return window.self !== window.top
  }
  catch {
    return true
  }
}
/**
 * group array into elements by key
 */
export function groupBy<
  T extends Record<string, any[]> = Record<string, any[]>,
>(items: any[], key: string): T {
  return items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  ) as T
}
/**
 * replace all instances of a string
 * (default replace only replaces the first instance)
 */
export function replaceAll(str: string, match: string, replacement: string): string {
  return str.replaceAll(new RegExp(regExpEscape(match), 'g'), () => replacement)
}
/**
 * base64 encode and decode a string in both node and browser
 */
export async function base64(args: {
  action: 'encode' | 'decode'
  str: string
}): Promise<string> {
  const { action, str } = args
  if (typeof window === 'undefined') {
    const { Buffer } = await import('node:buffer')
    if (action === 'encode')
      return Buffer.from(str).toString('base64')
    else
      return Buffer.from(str, 'base64').toString('ascii')
  }
  else {
    if (action === 'encode')
      return window.btoa(str)
    else
      return window.atob(str)
  }
}

function getNestedValue(obj: Record<string, any>, key: string): number | string | undefined {
  const r = key.split('.').reduce((acc, cur) => acc && acc[cur], obj)
  return r as unknown as number | string | undefined
}

export function sortByKey<T extends Record<string, unknown>>({
  data,
  key,
}: {
  data: T[]
  key: string
}) {
  if (!data || !key || data.length === 0)
    return data

  return data.sort((a, b) => {
    const aKey = getNestedValue(a, key)
    const bKey = getNestedValue(b, key)
    if (!aKey || !bKey)
      return 0
    else if (aKey < bKey)
      return -1
    else if (aKey > bKey)
      return 1

    return 0
  })
}

/**
 * RegExp-escapes all characters in the given string.
 */
export function regExpEscape(s: string): string {
  return s.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
}

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 * https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f
 */
export function wildcardToRegExp(s: string): RegExp {
  return new RegExp(
    `^${
    s
        .split(/\*+/)
        .map(_ => regExpEscape(_))
        .join('.*')
       }$`,
  )
}
