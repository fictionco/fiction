import { describe, expect, it } from 'vitest'
import { normalizeList } from '../list'
import { toLabel, toSlug } from '../casing'

describe('normalizeList', () => {
  it('handles empty arrays', () => {
    expect(normalizeList([])).toEqual([])
  })

  it('ignores undefined values in the array', () => {
    const input = [undefined, 'item1', undefined]
    const expected = [{ value: 'item1', name: 'Item1' }]
    expect(normalizeList(input)).toEqual(expected)
  })

  it('applies prefix and suffix correctly', () => {
    const input = ['item1', 'item2']
    const options = { prefix: 'pre ', suffix: ' suf' }
    const expected = [
      { value: 'item1', name: 'pre Item1 suf' },
      { value: 'item2', name: 'pre Item2 suf' },
    ]
    expect(normalizeList(input, options)).toEqual(expected)
  })

  it('transforms numbers correctly', () => {
    const input = [123, 456]
    const expected = [
      { value: 123, name: '123' },
      { value: 456, name: '456' },
    ]
    expect(normalizeList(input)).toEqual(expected)
  })

  it('transforms partial ListItems correctly', () => {
    const input = [{ name: 'Name1' }, { value: 'Value2' }]
    const expected = [
      { value: toSlug('Name1', { replaceNumbers: false }), name: 'Name1' },
      { value: 'Value2', name: `${toLabel('Value2')}` },
    ]
    expect(normalizeList(input)).toEqual(expected)
  })

  it('correctly transforms camelCase strings with toLabel', () => {
    const input = ['camelCaseValue', 'anotherCamelCase']
    const expected = [
      { value: 'camelCaseValue', name: 'Camel Case Value' },
      { value: 'anotherCamelCase', name: 'Another Camel Case' },
    ]
    expect(normalizeList(input)).toEqual(expected)
  })

  it('correctly kebabifies strings with toSlug', () => {
    const input = [{ name: 'Test String' }, { name: 'Another Test String' }]
    const expected = [
      { value: 'test-string', name: 'Test String' },
      { value: 'another-test-string', name: 'Another Test String' },
    ]
    expect(normalizeList(input)).toEqual(expected)
  })

  it('handles mixed types in array correctly', () => {
    const input = [123, 'camelCaseValue', { name: 'Test String' }, undefined]
    const expected = [
      { value: 123, name: '123' },
      { value: 'camelCaseValue', name: 'Camel Case Value' },
      { value: 'test-string', name: 'Test String' },
    ]
    expect(normalizeList(input)).toEqual(expected)
  })

  it('handles prefix and suffix with complex types', () => {
    const input = [{ name: 'ItemName' }, 'rawString', 123]
    const options = { prefix: 'pre-', suffix: '-suf' }
    const expected = [
      { value: 'item-name', name: 'pre-ItemName-suf' },
      { value: 'rawString', name: 'pre-Raw String-suf' },
      { value: 123, name: 'pre-123-suf' },
    ]
    expect(normalizeList(input, options)).toEqual(expected)
  })

  it('ensures name is toLabel(value) when name is missing', () => {
    const input = [{ value: 'someValue' }, { value: 'anotherValue123' }]
    const expected = [
      { value: 'someValue', name: 'Some Value' },
      { value: 'anotherValue123', name: 'Another Value123' },
    ]
    expect(normalizeList(input)).toEqual(expected)
  })

  it('ensures value is toSlug(name) when value is missing', () => {
    const input = [{ name: 'Some Name' }, { name: 'AnotherName123' }]
    const expected = [
      { value: 'some-name', name: 'Some Name' },
      { value: 'another-name123', name: 'AnotherName123' },
    ]
    expect(normalizeList(input)).toEqual(expected)
  })
})
