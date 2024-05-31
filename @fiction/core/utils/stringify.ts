import { fromJSON, parse, stringify, toJSON } from 'flatted'

export function flatStringify<T = unknown>(value: T): string {
  return stringify(value)
}

export function flatParse<T = unknown>(value: string): T {
  return parse(value)
}
