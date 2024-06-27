// toCamel.test.ts
import { describe, expect, it } from 'vitest'
import { capitalize, convertKeyCase, stopWordLowercase, toCamel, toKebab, toLabel, toPascal, toSlug, toSnake } from '../casing'

describe('toCamel', () => {
  it('converts SNAKE_CASE to camelCase', () => {
    expect(toCamel('FOO_BAR')).toBe('fooBar')
    expect(toCamel('HELLO__WORLD')).toBe('helloWorld')
  })

  it('converts space-separated words to camelCase', () => {
    expect(toCamel('foo bar')).toBe('fooBar')
    expect(toCamel('hello world')).toBe('helloWorld')
  })

  it('converts hyphen-separated words to camelCase', () => {
    expect(toCamel('foo-bar')).toBe('fooBar')
    expect(toCamel('hello-world')).toBe('helloWorld')
  })

  it('converts underscore-separated words to camelCase', () => {
    expect(toCamel('foo_bar')).toBe('fooBar')
    expect(toCamel('hello_world')).toBe('helloWorld')
  })

  it('converts PascalCase words to camelCase', () => {
    expect(toCamel('FooBar')).toBe('fooBar')
    expect(toCamel('HelloWorld')).toBe('helloWorld')
  })

  it('handles mixed separators and cases', () => {
    expect(toCamel('foo-Bar_baz')).toBe('fooBarBaz')
    expect(toCamel('Hello-world_baz')).toBe('helloWorldBaz')
  })

  it('handles single-word input', () => {
    expect(toCamel('foo')).toBe('foo')
    expect(toCamel('Bar')).toBe('bar')
  })

  it('returns an empty string for empty input', () => {
    expect(toCamel('')).toBe('')
  })
})

describe('toCamel with period handling', () => {
  it('converts period-separated words to camelCase when allowPeriods is false', () => {
    expect(toCamel('foo.bar', { allowPeriods: false })).toBe('fooBar')
    expect(toCamel('hello.world', { allowPeriods: false })).toBe('helloWorld')
  })

  it('leaves periods intact when allowPeriods is true', () => {
    expect(toCamel('foo.bar', { allowPeriods: true })).toBe('foo.bar')
    expect(toCamel('hello.world', { allowPeriods: true })).toBe('hello.world')
  })

  it('handles mixed separators including periods with allowPeriods false', () => {
    expect(toCamel('foo-bar.baz', { allowPeriods: false })).toBe('fooBarBaz')
    expect(toCamel('hello_world.baz', { allowPeriods: false })).toBe('helloWorldBaz')
  })

  it('handles mixed separators including periods with allowPeriods true', () => {
    expect(toCamel('foo-bar.baz', { allowPeriods: true })).toBe('fooBar.baz')
    expect(toCamel('hello_world.baz', { allowPeriods: true })).toBe('helloWorld.baz')
  })
})

describe('toSlug', () => {
  it('converts text to lowercase kebab-case', () => {
    expect(toSlug('Hello World')).toBe('hello-world')
    expect(toSlug('Another Test')).toBe('another-test')
    expect(toSlug('anotherTest')).toBe('another-test')
    expect(toSlug('AnotherTest')).toBe('another-test')
  })

  it('removes special characters', () => {
    expect(toSlug('Text with $pecial @characters!')).toBe('text-with-pecial-characters')
  })

  it('replaces spaces with hyphens', () => {
    expect(toSlug('Text with multiple spaces')).toBe('text-with-multiple-spaces')
  })

  it('handles empty and undefined input', () => {
    expect(toSlug('')).toBe('')
    expect(toSlug()).toBe('')
  })

  it('preserves numbers when replaceNumbers option is false', () => {
    expect(toSlug('123 numbers', { replaceNumbers: true })).toBe('numbers')
  })

  it('removes numbers when replaceNumbers option is true', () => {
    expect(toSlug('123 numbers')).toBe('123-numbers')
  })

  it('handles mixed cases, spaces, and special characters', () => {
    expect(toSlug('Mixed: Upper and Lower, numbers 123, and $pecial', { replaceNumbers: false }))
      .toBe('mixed-upper-and-lower-numbers-123-and-pecial')
  })

  it('handles strings that already look like slugs', () => {
    expect(toSlug('already-a-slug')).toBe('already-a-slug')
  })

  it('converts to lowercase when lowercase option is true', () => {
    expect(toSlug('LOWERCASE', { maintainCase: false })).toBe('lowercase')
  })

  it('maintains case when lowercase option is false', () => {
    expect(toSlug('MAINTAIN CASE', { maintainCase: true, replaceNumbers: false })).toBe('MAINTAIN-CASE')
  })
})

describe('stopWordLowercase', () => {
  it('should return the original string if it contains one word or less', () => {
    expect(stopWordLowercase('Hello')).toBe('Hello')
    expect(stopWordLowercase('')).toBe('')
  })

  it('should make stop words lowercase, except if at the beginning of a string', () => {
    expect(stopWordLowercase('And This Is A Test', ['and', 'a'])).toBe('And This Is a Test')
    expect(stopWordLowercase('A Quick Brown Fox', ['a'])).toBe('A Quick Brown Fox')
    expect(stopWordLowercase('This And That', ['and'])).toBe('This and That')
  })

  it('should work correctly without a custom stop words list', () => {
    // Assuming 'and' and 'to' are in the default stopwordsLib
    expect(stopWordLowercase('And I Went To The Store')).toBe('And I Went to the Store')
  })

  it('should handle multiple occurrences of stop words correctly', () => {
    expect(stopWordLowercase('The Fox And The Dog Are Friends', ['the', 'and'])).toBe('The Fox and the Dog Are Friends')
  })

  it('should not modify other words', () => {
    expect(stopWordLowercase('Hello World', ['hello'])).toBe('Hello World')
  })
})

describe('toLabel', () => {
  it('should return an empty string for null or undefined inputs', () => {
    expect(toLabel()).toBe('')
    // @ts-expect-error undefined input
    expect(toLabel(null)).toBe('')
  })

  it('should handle numbers and convert them to strings', () => {
    expect(toLabel(123)).toBe('123')
  })

  it('should convert camelCase and snake_case to space-separated words with proper capitalization', () => {
    expect(toLabel('helloWorld')).toBe('Hello World')
    expect(toLabel('hello_world')).toBe('Hello World')
  })

  it('should handle kebab-case and convert it to space-separated words with proper capitalization', () => {
    expect(toLabel('hello-world')).toBe('Hello World')
  })

  it('should remove special characters and slashes', () => {
    expect(toLabel('hello/world')).toBe('Hello World')
  })

  it('should lowercase stop words except when they are the first word', () => {
    expect(toLabel('andHelloWorld')).toBe('And Hello World')
    expect(toLabel('helloWorldAnd')).toBe('Hello World and')
  })
})

describe('toPascal', () => {
  it('converts single words correctly', () => {
    expect(toPascal('word')).toBe('Word')
    expect(toPascal('WORD')).toBe('Word')
  })

  it('converts snake_case correctly', () => {
    expect(toPascal('snake_case_string')).toBe('SnakeCaseString')
  })

  it('converts kebab-case correctly', () => {
    expect(toPascal('kebab-case-string')).toBe('KebabCaseString')
  })

  it('converts strings with spaces correctly', () => {
    expect(toPascal('string with spaces')).toBe('StringWithSpaces')
  })

  it('handles mixed cases and non-alphanumeric characters', () => {
    expect(toPascal('string@with#special!characters')).toBe('StringWithSpecialCharacters')
  })

  it('handles empty strings and strings with only non-alphanumeric characters', () => {
    expect(toPascal('')).toBe('')
    expect(toPascal('@@@')).toBe('')
  })
})

describe('toSnake', () => {
  it('converts camelCase to snake_case correctly', () => {
    expect(toSnake('camelCaseString')).toBe('camel_case_string')
  })

  it('converts PascalCase to snake_case correctly', () => {
    expect(toSnake('PascalCaseString')).toBe('pascal_case_string')
  })

  it('converts camelCase to UPPER_SNAKE_CASE correctly', () => {
    expect(toSnake('camelCaseString', { upper: true })).toBe('CAMEL_CASE_STRING')
  })

  it('converts PascalCase to UPPER_SNAKE_CASE correctly', () => {
    expect(toSnake('PascalCaseString', { upper: true })).toBe('PASCAL_CASE_STRING')
  })

  it('handles single words correctly', () => {
    expect(toSnake('Word')).toBe('word')
    expect(toSnake('Word', { upper: true })).toBe('WORD')
  })

  it('handles empty string correctly', () => {
    expect(toSnake('')).toBe('')
  })

  it('removes leading underscores', () => {
    expect(toSnake('_LeadingUnderscore')).toBe('leading_underscore')
  })
})

describe('convertKeyCase', () => {
  const exampleObj = {
    firstName: 'John',
    lastName: 'Doe',
    address: {
      streetName: 'Main Street',
      city: 'Anytown',
    },
  }

  const exampleArray = [
    {
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
    },
  ]

  it('should convert object keys to snake case', () => {
    const result = convertKeyCase(exampleObj, { mode: 'snake' })
    expect(result).toEqual({
      first_name: 'John',
      last_name: 'Doe',
      address: {
        street_name: 'Main Street',
        city: 'Anytown',
      },
    })
  })

  it('should convert object keys to camel case', () => {
    const result = convertKeyCase({
      first_name: 'John',
      last_name: 'Doe',
      address: {
        street_name: 'Main Street',
        city: 'Anytown',
      },
    }, { mode: 'camel' })

    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      address: {
        streetName: 'Main Street',
        city: 'Anytown',
      },
    })
  })

  it('should convert array of objects keys to snake case', () => {
    const result = convertKeyCase(exampleArray, { mode: 'snake' })
    expect(result).toEqual([
      {
        first_name: 'John',
        last_name: 'Doe',
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
      },
    ])
  })

  it('should convert array of objects keys to camel case', () => {
    const result = convertKeyCase([
      {
        first_name: 'John',
        last_name: 'Doe',
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
      },
    ], { mode: 'camel' })

    expect(result).toEqual([
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
      },
    ])
  })

  it('should handle empty objects', () => {
    const result = convertKeyCase({}, { mode: 'snake' })
    expect(result).toEqual({})
  })

  it('should handle empty arrays', () => {
    const result = convertKeyCase([], { mode: 'snake' })
    expect(result).toEqual([])
  })

  it('should handle non-object and non-array values', () => {
    const result = convertKeyCase('test', { mode: 'snake' })
    expect(result).toBe('test')
  })
})

describe('toKebab', () => {
  it('should convert camelCase to kebab-case', () => {
    const result = toKebab('camelCaseString')
    expect(result).toBe('camel-case-string')
  })

  it('should handle empty string', () => {
    const result = toKebab('')
    expect(result).toBe('')
  })
})

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    const result = capitalize('hello')
    expect(result).toBe('Hello')
  })

  it('should return an empty string if input is not a string', () => {
    const result = capitalize(null as any)
    expect(result).toBe('')
  })
})
