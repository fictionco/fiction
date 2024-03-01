import { log } from '@factor/api'

export function getCleanUrl(url: string): string {
  if (!url)
    return ''

  const u = new URL(url.trim())

  return u.host.replace('www.', '')
}

/**
 * Remove trailing slash from pathname unless it is root '/'
 */
export function standardUrl(opts: {
  url?: string
  part?: 'pathname' | 'hostname' | 'origin' | 'search'
}): string {
  const { url, part = 'pathname' } = opts
  if (!url)
    return ''

  let u: URL
  try {
    u = new URL(url)
  }
  catch (error) {
    log.error('standardUrl', `poorly formatted url: ${url}`, { error })
    return ''
  }

  if (part === 'pathname') {
    const pathname = u.pathname
    if (pathname === '/')
      return pathname
    else return pathname.replace(/\/$/, '')
  }
  else if (part === 'hostname') {
    return u.hostname
  }
  else if (part === 'origin') {
    return u.origin
  }
  else if (part === 'search') {
    return u.search
  }
  else {
    return ''
  }
}

export function onlyAllowedKeys<T extends Record<string, any>>(obj: T, allowedKeys: string[]): T {
  const out: Record<string, any> = {}
  allowedKeys.forEach((key) => {
    if (obj[key] !== undefined)
      out[key] = obj[key] as unknown
  })
  return out as T
}
/**
 * Sum the numbers in an array of numbers
 */
export function sumValues(values: (number | undefined)[], initialValue = 0): number {
  const numberValues = values.filter(Boolean) as number[]

  return numberValues.reduce((a, b) => a + b, initialValue)
}
/**
 * Average an array of numbers, not counting 0s and removing nullish values
 * In the case of analytics, zero is typically a null value (e.g. scroll depth of 0 or load time of zero)
 */
export function averageValuesExcludeZero(values: (number | undefined)[]): number {
  const numberValues = values.filter(Boolean) as number[]

  return numberValues.reduce((a, b) => a + b) / numberValues.length
}
/**
 * Formats bytes into something human readable
 */
function formatByteSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes} bytes`
  else if (bytes < 1_048_576)
    return `${(bytes / 1024).toFixed(3)} KiB`
  else if (bytes < 1_073_741_824)
    return `${(bytes / 1_048_576).toFixed(3)} MiB`
  else return `${(bytes / 1_073_741_824).toFixed(3)} GiB`
}
/**
 * Gets the size if an object when stored in memory
 * https://gist.github.com/zensh/4975495#file-memorysizeofobject-js-L2
 */
export function memorySizeOf(obj: unknown): string {
  let bytes = 0

  const sizeOf = (obj: unknown): number => {
    if (obj !== null && obj !== undefined) {
      const type = typeof obj

      if (type === 'number') {
        bytes += 8
      }
      else if (type === 'string') {
        bytes += (obj as string).length * 2
      }
      else if (type === 'boolean') {
        bytes += 4
      }
      else if (type === 'object') {
        const theObject = obj as Record<any, any>
        const objClass = Object.prototype.toString.call(theObject).slice(8, -1)
        if (objClass === 'Object' || objClass === 'Array') {
          for (const key in theObject as Record<any, any>) {
            if (!theObject[key])
              continue
            sizeOf(theObject[key])
          }
        }
        else {
          bytes += theObject.toString().length * 2
        }
      }
    }
    return bytes
  }

  return formatByteSize(sizeOf(obj))
}
