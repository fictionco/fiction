import { describe, expect, it } from 'vitest'
import { groupBy, isJson, stringify } from '../utils'

describe('utils', () => {
  it('isJson', async () => {
    const invalid = isJson('not valid json')
    const valid = isJson(`{"valid": "yes"}`)
    expect(invalid).toBeFalsy()
    expect(valid).toBeTruthy()
  })

  it('groupBy', async () => {
    const data = [
      { animal: 'ape', age: 10 },
      { animal: 'ape', age: 12 },
      { animal: 'giraffe', age: 12 },
      { animal: 'giraffe', age: 3 },
    ]
    const result = groupBy(data, 'animal')
    expect(result).toMatchInlineSnapshot(`
      {
        "ape": [
          {
            "age": 10,
            "animal": "ape",
          },
          {
            "age": 12,
            "animal": "ape",
          },
        ],
        "giraffe": [
          {
            "age": 12,
            "animal": "giraffe",
          },
          {
            "age": 3,
            "animal": "giraffe",
          },
        ],
      }
    `)
  })
})

describe('stringify', () => {
  it('should handle circular structures', () => {
    const circularObj: any = {}
    circularObj.self = circularObj
    expect(stringify(circularObj)).toBe('{}') // Adjust expected result based on your implementation
  })

  it('should handle arrays', () => {
    const array = [1, 'string', null]
    expect(stringify(array)).toBe('[\n  1,\n  "string",\n  null\n]')
  })

  it('should handle strings', () => {
    const str = 'Hello, world!'
    expect(stringify(str)).toBe('"Hello, world!"')
  })

  it('should handle numbers', () => {
    const num = 123
    expect(stringify(num)).toBe('123')
  })

  it('should handle null', () => {
    expect(stringify(null)).toBe('null')
  })

  it('should handle undefined', () => {
    expect(stringify(undefined)).toBeUndefined()
  })

  it('should handle objects', () => {
    const obj = { a: 1, b: 'test', c: null }
    expect(stringify(obj)).toBe('{\n  "a": 1,\n  "b": "test",\n  "c": null\n}')
  })

  it('should handle booleans', () => {
    expect(stringify(true)).toBe('true')
    expect(stringify(false)).toBe('false')
  })

  // Add more tests for edge cases and other data types as needed
})
