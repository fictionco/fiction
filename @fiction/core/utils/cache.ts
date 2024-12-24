export function getCacheKey<T extends string = string>(type: T, ...args: string[]) {
  return `${[type, ...args].join(':')}`
}
