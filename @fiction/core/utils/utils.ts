import path from 'node:path'
import stableStringify from 'fast-safe-stringify'
import md5 from 'spark-md5'
import { isNode } from './vars.js'

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
 * Wait for specific amount of time
 * @param ms - milliseconds
 */
export async function waitFor(ms: number): Promise<void> {
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
    const { getNodeBuffer } = await import('./nodeUtils.js')
    const Buffer = await getNodeBuffer()
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
