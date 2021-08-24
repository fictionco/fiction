interface Omit {
  <T extends Record<string, any>, K extends [...(keyof T)[]]>(
    obj: T,
    ...keys: K
  ): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2]
  }
}
/**
 * Remove keys from an object
 */
export const omit: Omit = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: typeof obj[K]
  }
  let key: keyof typeof obj
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key]
    }
  }
  return ret
}
/**
 * Throttle a function to run only every period
 */
export const throttle = (
  func: (...args: any[]) => any,
  period: number,
): ((...args: any) => any) => {
  let inThrottle: boolean

  return function (this: any, ...args: any[]): any {
    if (!inThrottle) {
      inThrottle = true
      func.apply(this, args)
      setTimeout(() => (inThrottle = false), period)
    }
  }
}
