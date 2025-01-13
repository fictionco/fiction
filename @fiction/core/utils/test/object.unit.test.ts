import { describe, expect, it } from 'vitest'
import { deepMerge, deepMergeAll, findValueByKey, getDotpathArrayIndices, isPlainObject, omit, parseObject, removeUndefined } from '../obj'

describe('getDotpathArrayIndices', () => {
  it('extracts numbers from dot-separated paths', () => {
    expect(getDotpathArrayIndices('items.0.title')).toEqual([0])
    expect(getDotpathArrayIndices('items.2.sub.1')).toEqual([2, 1])
    expect(getDotpathArrayIndices('items.5')).toEqual([5])
  })

  it('handles undefined and empty paths', () => {
    expect(getDotpathArrayIndices()).toEqual([])
    expect(getDotpathArrayIndices('')).toEqual([])
  })

  it('ignores numbers not between dots', () => {
    expect(getDotpathArrayIndices('link2')).toEqual([])
    expect(getDotpathArrayIndices('page5view')).toEqual([])
    expect(getDotpathArrayIndices('items.1.page5')).toEqual([1])
  })

  it('handles paths ending in number', () => {
    expect(getDotpathArrayIndices('item.2')).toEqual([2])
    expect(getDotpathArrayIndices('items.sub.5')).toEqual([5])
  })
})

describe('removeUndefined', () => {
  it('removes undefined by default', () => {
    const input = [1, undefined, 3, null, 5]
    const output = removeUndefined(input)
    expect(output).toEqual([1, 3, null, 5]) // Removes only undefined
  })

  it('removes undefined and null with option', () => {
    const input = [1, undefined, 3, null, 5]
    const output = removeUndefined(input, { removeNull: true })
    expect(output).toEqual([1, 3, 5]) // Removes both undefined and null
  })

  it('removes undefined from object (default)', () => {
    const input = { a: 1, b: undefined, c: { d: undefined, e: 2 } }
    const output = removeUndefined(input)
    expect(output).toEqual({ a: 1, c: { e: 2 } }) // Removes only undefined
  })

  it('removes undefined and null from object with option', () => {
    const input = { a: 1, b: undefined, c: { d: undefined, e: 2 } }
    const output = removeUndefined(input, { removeNull: true })
    expect(output).toEqual({ a: 1, c: { e: 2 } }) // Removes both undefined and null
  })

  it('handles nested undefined and null values with option', () => {
    const input = { a: [1, undefined, 3], b: { c: undefined, d: [null, 5] } }
    const output = removeUndefined(input, { removeNull: true })
    expect(output).toEqual({ a: [1, 3], b: { d: [5] } }) // Removes both undefined and null
  })

  it('preserves non-undefined values', () => {
    const input = { a: 'hello', b: 0, c: true }
    const output = removeUndefined(input)
    expect(output).toEqual(input)
  })

  it('returns undefined for undefined input', () => {
    const output = removeUndefined(undefined)
    expect(output).toBeUndefined()
  })

  it('handles other data types', () => {
    const input = 10
    const output = removeUndefined(input)
    expect(output).toBe(input)
  })
})

describe('parseObject utility', () => {
  it('should handle primitive values', () => {
    const result = parseObject({
      obj: 123,
      onValue: ({ value }) => typeof value === 'number' ? value * 2 : value,
    })
    expect(result).toBe(246)
  })

  it('should handle arrays', () => {
    const result = parseObject({
      obj: [1, 2, 3],
      onValue: ({ value }) => typeof value === 'number' ? value * 2 : value,
    })
    expect(result).toEqual([2, 4, 6])
  })

  it('should handle nested objects', () => {
    const result = parseObject({
      obj: { a: 1, b: { c: 2, d: 3 } },
      onValue: ({ value }) => typeof value === 'number' ? value * 2 : value,
    })
    expect(result).toEqual({ a: 2, b: { c: 4, d: 6 } })
  })

  it('should handle Date and RegExp objects properly', () => {
    const date = new Date()
    const regex = /abc/
    const result = parseObject({
      obj: { date, regex },
      onValue: ({ value }) => value instanceof Date ? value.toISOString() : value,
    })
    expect(result).toEqual({ date: date.toISOString(), regex })
  })

  it('should handle strings', () => {
    const result = parseObject({
      obj: 'hello',
      onValue: ({ value }) => typeof value === 'string' ? value.toUpperCase() : value,
    })
    expect(result).toBe('HELLO')
  })

  // Add any additional test cases here...
})
describe('isPlainObject', () => {
  it('should return false for non-object types', () => {
    expect(isPlainObject('string')).toBeFalsy()
    expect(isPlainObject(123)).toBeFalsy()
    expect(isPlainObject(true)).toBeFalsy()
    expect(isPlainObject(undefined)).toBeFalsy()
    expect(isPlainObject(null)).toBeFalsy()
    expect(isPlainObject(() => {})).toBeFalsy()
    expect(isPlainObject([])).toBeFalsy()
  })

  it('should return false for object-like types', () => {
    expect(isPlainObject(new Date())).toBeFalsy()
    expect(isPlainObject(new Error('foo'))).toBeFalsy()
    expect(isPlainObject(/regex/)).toBeFalsy()
    expect(isPlainObject(new Map())).toBeFalsy()
  })

  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBeTruthy()
    expect(isPlainObject({ key: 'value' })).toBeTruthy()
    expect(isPlainObject(Object.create(null))).toBeTruthy()
  })

  it('should return false for objects with a changed prototype', () => {
    const obj = {}
    Object.setPrototypeOf(obj, { newProp: 'value' })
    expect(isPlainObject(obj)).toBeFalsy()
  })
})

describe('deepMerge Tests', () => {
  it('should merge two simple objects', () => {
    const obj1 = { a: 1 }
    const obj2 = { b: 2 }
    const result = deepMerge([obj1, obj2], {})
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should override properties from higher priority', () => {
    const obj1 = { a: 1, c: 3 }
    const obj2 = { a: 2 }
    const result = deepMerge([obj1, obj2], {})
    expect(result).toEqual({ a: 2, c: 3 })
  })

  it('should ignore undefined objects', () => {
    const obj1 = { a: 1 }
    const undefinedObj = undefined
    const result = deepMerge([obj1, undefinedObj], {})
    expect(result).toEqual({ a: 1 })
  })

  it('should merge arrays based on mergeArrays option', () => {
    const obj1 = { items: [1, 2] }
    const obj2 = { items: [3, 4] }
    const mergedConcat = deepMerge([obj1, obj2], { mergeArrays: true })
    const mergedOverride = deepMerge([obj1, obj2], { mergeArrays: false })
    expect(mergedConcat).toEqual({ items: [1, 2, 3, 4] })
    expect(mergedOverride).toEqual({ items: [3, 4] })
  })
})

describe('deepMergeAll Tests', () => {
  it('should merge all objects and concatenate arrays', () => {
    const obj1 = { a: 1, items: ['a', 'b'] }
    const obj2 = { b: 2, items: ['c', 'd'] }
    const result = deepMergeAll([obj1, obj2])
    expect(result).toEqual({ a: 1, b: 2, items: ['a', 'b', 'c', 'd'] })
  })
})

describe('findValueByKey', () => {
  it('finds a value in a simple object', () => {
    const obj = { keyOfInterest: 'value1' }
    const result = findValueByKey(obj, 'keyOfInterest')
    expect(result).toBe('value1')
  })

  it('finds a value in a nested object', () => {
    const obj = { nested: { keyOfInterest: 'value2' } }
    const result = findValueByKey(obj, 'keyOfInterest')
    expect(result).toBe('value2')
  })

  it('finds a value in an array', () => {
    const obj = [{ keyOfInterest: 'value3' }]
    const result = findValueByKey(obj, 'keyOfInterest')
    expect(result).toBe('value3')
  })

  it('finds a value in a nested array', () => {
    const obj = { array: [{ keyOfInterest: 'value4' }] }
    const result = findValueByKey(obj, 'keyOfInterest')
    expect(result).toBe('value4')
  })

  it('returns undefined if the key is not found', () => {
    const obj = { anotherKey: 'value' }
    const result = findValueByKey(obj, 'keyOfInterest')
    expect(result).toBeUndefined()
  })

  it('handles mixed nested structures', () => {
    const obj = {
      a: { b: [{ keyOfInterest: 'value5' }, 'otherValue'] },
      c: 'anotherValue',
      d: [{ e: 'yetAnotherValue', f: { keyOfInterest: 'value6' } }],
    }
    const result = findValueByKey(obj, 'keyOfInterest')
    expect(result).toBe('value5')
  })
})

describe('omit', () => {
  it('should remove specified keys from an object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, 'a', 'b')
    expect(result).toEqual({ c: 3 })
  })

  it('should not modify the original object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    omit(obj, 'a')
    expect(obj).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should return an empty object if all keys are omitted', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, 'a', 'b')
    expect(result).toEqual({})
  })

  it('should handle objects with various value types', () => {
    const obj = { a: 1, b: 'string', c: true, d: { nested: 'object' } }
    const result = omit(obj, 'a', 'c')
    expect(result).toEqual({ b: 'string', d: { nested: 'object' } })
  })

  it('should do nothing if the specified keys do not exist', () => {
    const obj = { a: 1, b: 2 }
    // @ts-expect-error  Keys 'c' and 'd' do not exist in obj
    const result = omit(obj, 'c', 'd')
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should be able to handle an empty object', () => {
    const obj = {}
    // @ts-expect-error  Trying to omit 'a' from an empty object
    const result = omit(obj, 'a')
    expect(result).toEqual({})
  })
})
