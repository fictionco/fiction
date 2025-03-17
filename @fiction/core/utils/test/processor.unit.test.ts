import type { Processor } from '../processors'
import { createTestUtils } from '@fiction/core/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { ObjectProcessor, Shortcodes } from '../processors'

describe('shortcodes tests', () => {
  const testUtils = createTestUtils()
  const fictionEnv = testUtils.fictionEnv
  const shortcodes = new Shortcodes({ fictionEnv })
  shortcodes.addShortcode({ shortcode: 'mock', handler: () => 'MockResult' })
  shortcodes.addShortcode({ shortcode: 'mock_attr', handler: (args) => {
    const attr = Object.entries(args.attributes || {}).map(([key, value]) => `${key}:${value}`).join(', ')
    return `MockResult: ${attr}`
  } })

  it('should parse attributes with escaped quotes', async () => {
    // Adjust the input string to include double backslashes before quotes,
    // simulating the actual input that might be causing issues at runtime.
    const result = shortcodes.parseAttributes(`search=\\\"test\\\"`)

    const expected = { search: 'test' }
    expect(result).toEqual(expected)
  })

  it('should parse a string with a cwd shortcode', async () => {
    const { text } = await shortcodes.parseString('Current directory: [@cwd]')
    expect(text).toBe(`Current directory: ${testUtils.fictionEnv.cwd}`)
  })

  it('should parse a string with date and time shortcodes', async () => {
    const dateString = new Date().toLocaleDateString()
    const timeString = new Date().toLocaleTimeString()
    const result = await shortcodes.parseString('Today is [@date] and the time is [@time]')
    expect(result.text).toBe(`Today is ${dateString} and the time is ${timeString}`)
  })

  it('should handle custom shortcodes', async () => {
    shortcodes.addShortcode({ shortcode: 'greeting', handler: () => 'Hello World' })
    const result = await shortcodes.parseString('Greeting: [@greeting]')
    expect(result.text).toBe('Greeting: Hello World')
  })

  it('should recursively parse an object with shortcodes', async () => {
    const settings = {
      directory: '[@cwd]',
      today: '[@date]',
      greeting: 'Welcome to [@siteName]',
    }
    shortcodes.addShortcode({ shortcode: 'siteName', handler: () => 'MySite' })
    const parsedSettings = await shortcodes.parseObject(settings)
    expect(parsedSettings).toEqual({
      directory: testUtils.fictionEnv.cwd,
      today: new Date().toLocaleDateString(),
      greeting: 'Welcome to MySite',
    })
  })

  it('should correctly process content within shortcodes', async () => {
    shortcodes.addShortcode({ shortcode: 'sc', handler: args => `Processed: ${args.content}` })
    const result = await shortcodes.parseString('[@sc]sample content[/@sc]')
    expect(result.text).toBe('Processed: sample content')
  })

  it('should handle nested content shortcodes', async () => {
    shortcodes.addShortcode({ shortcode: 'outer', handler: args => `Outer Start ${args.content} Outer End` })
    shortcodes.addShortcode({ shortcode: 'inner', handler: args => `Inner Start ${args.content} Inner End` })
    const result = await shortcodes.parseString('[@outer][@inner]content[/@inner][/@outer]')
    expect(result.text).toBe('Outer Start Inner Start content Inner End Outer End')
  })

  it('should handle shortcodes with attributes', async () => {
    shortcodes.addShortcode({ shortcode: 'sc', handler: args => `Attribute: ${args.attributes?.attribute}, Content: ${args.content}` })
    const result = await shortcodes.parseString('[@sc attribute="value"]sample content[/@sc]')
    expect(result.text).toBe('Attribute: value, Content: sample content')
  })

  // Testing multiple attributes
  it('should handle shortcodes with multiple attributes', async () => {
    shortcodes.addShortcode({ shortcode: 'multi', handler: (args) => {
      return `Attributes: ${args.attributes?.first}, ${args.attributes?.second}; Content: ${args.content}`
    } })
    const result = await shortcodes.parseString('[@multi first="one" second="two"]content here[/@multi]')
    expect(result.text).toBe('Attributes: one, two; Content: content here')
  })

  // Testing shortcodes with attributes but no content
  it('should handle shortcodes with attributes but no content', async () => {
    shortcodes.addShortcode({ shortcode: 'attrOnly', handler: args => `Only attribute: ${args.attributes?.only}` })
    const result = await shortcodes.parseString('[@attrOnly only="attribute-value"]')
    expect(result.text).toBe('Only attribute: attribute-value')
  })

  // Testing shortcodes with empty attributes
  it('should handle shortcodes with empty attributes', async () => {
    shortcodes.addShortcode({ shortcode: 'emptyAttr', handler: args => `Empty attribute: ${args.attributes?.empty}` })
    const result = await shortcodes.parseString('[@emptyAttr empty=""]')
    expect(result.text).toBe('Empty attribute: ')
  })

  it('should return empty string when input is empty', async () => {
    const result = await shortcodes.parseString('')
    expect(result.text).toBe('')
  })

  it('should return the original string if it contains no shortcodes', async () => {
    const original = 'This is a test string without shortcodes.'
    const result = await shortcodes.parseString(original)
    expect(result.text).toBe(original)
  })

  it('should ignore unrecognized shortcodes', async () => {
    const original = 'This string contains an [@unknown] shortcode.'
    const result = await shortcodes.parseString(original)
    expect(result.text).toBe(original)
  })

  // Testing shortcodes with special characters
  it('should handle shortcodes with special characters in names and attributes', async () => {
    shortcodes.addShortcode({ shortcode: 'special@char', handler: args => `Special: ${args.attributes?.['attr@special']}` })
    const result = await shortcodes.parseString('[@special@char attr@special="value"]')
    expect(result.text).toBe('Special: value')
  })

  // Testing handling of different whitespace patterns
  it('should handle different types of whitespace within shortcode tags and attributes', async () => {
    shortcodes.addShortcode({ shortcode: 'whitespace', handler: () => 'Whitespace handled' })
    const result = await shortcodes.parseString('[@  whitespace   ]')
    expect(result.text).toBe('Whitespace handled')
  })

  // Testing attribute quotes handling
  it('should correctly parse single and double quotes in attribute values', async () => {
    shortcodes.addShortcode({ shortcode: 'quoteTest', handler: args => `Quote: ${args.attributes?.quote}` })
    const singleQuoteResult = await shortcodes.parseString('[@quoteTest quote=\'single quote\']')
    const doubleQuoteResult = await shortcodes.parseString('[@quoteTest quote="double quote"]')
    expect(singleQuoteResult.text).toBe('Quote: single quote')
    expect(doubleQuoteResult.text).toBe('Quote: double quote')
  })

  // Testing escaping of shortcodes
  it('should not treat escaped shortcodes as valid', async () => {
    const result = await shortcodes.parseString('This is not a shortcode: \\[@escaped]')
    expect(result.text).toBe('This is not a shortcode: [@escaped]')
  })

  // Testing error handling for invalid shortcode formats
  it('should gracefully handle invalid shortcode formats', async () => {
    const invalidFormatString = 'This is an invalid format: [@invalid'
    const result = await shortcodes.parseString(invalidFormatString)
    expect(result.text).toBe(invalidFormatString)
  })

  it('should parse escaped string values', async () => {
    const input = `"""
    {
      "userConfig": {
        "mediaItems": [
          {
            "media": {
              "url": "[@mock_attr search=\"futuristic secret agent technology\" orientation=\"landscape\" description=\"spies playing baseball\"]",
              "format": "url"
            }
          }
        ]
      }
    }"""`

    expect(await shortcodes.parseObject({ input })).toMatchInlineSnapshot(`
      {
        "input": """"
          {
            "userConfig": {
              "mediaItems": [
                {
                  "media": {
                    "url": "MockResult: search:futuristic secret agent technology, orientation:landscape, description:spies playing baseball",
                    "format": "url"
                  }
                }
              ]
            }
          }"""",
      }
    `)
  })

  it('should parse simple string values', async () => {
    const input = { key: 'Some [@mock]' }
    const expected = { key: 'Some MockResult' }
    expect(await shortcodes.parseObject(input)).toEqual(expected)
  })

  it('should recursively parse nested objects', async () => {
    const input = { nested: { key: 'Nested [@mock]' } }
    const expected = { nested: { key: 'Nested MockResult' } }
    expect(await shortcodes.parseObject(input)).toEqual(expected)
  })

  it('should parse each object in an array of objects', async () => {
    const input = { array: [{ key: 'Item 1 [@mock]' }, { key: 'Item 2 [@mock]' }] }
    const expected = { array: [{ key: 'Item 1 MockResult' }, { key: 'Item 2 MockResult' }] }
    expect(await shortcodes.parseObject(input)).toEqual(expected)
  })

  it('should parse each string in an array of strings', async () => {
    const input = { array: ['String 1 [@mock]', 'String 2 [@mock]'] }
    const expected = { array: ['String 1 MockResult', 'String 2 MockResult'] }
    expect(await shortcodes.parseObject(input)).toEqual(expected)
  })

  it('should correctly handle objects with mixed types', async () => {
    const input = { string: 'Some [@mock]', array: ['String [@mock]'], nested: { key: 'Nested [@mock]' } }
    const expected = { string: 'Some MockResult', array: ['String MockResult'], nested: { key: 'Nested MockResult' } }
    expect(await shortcodes.parseObject(input)).toEqual(expected)
  })

  it('should leave non-string values unchanged', async () => {
    const input = { number: 123, boolean: true, nullValue: null }
    expect(await shortcodes.parseObject(input)).toEqual(input)
  })
})

describe('synchronous shortcodes', () => {
  const testUtils = createTestUtils()
  const fictionEnv = testUtils.fictionEnv
  const shortcodes = new Shortcodes({ fictionEnv })
  beforeEach(() => {
    shortcodes.clear()
  })

  it('should parse a string with synchronous shortcodes', () => {
    const result = shortcodes.parseStringSync('Current directory: [@cwd]')
    expect(result.text).toBe(`Current directory: ${testUtils.fictionEnv.cwd}`)
  })

  it('should handle custom synchronous shortcodes', () => {
    shortcodes.addShortcode({ shortcode: 'syncGreeting', handler: () => 'Hello Sync World' })
    const result = shortcodes.parseStringSync('Sync Greeting: [@syncGreeting]')
    expect(result.text).toBe('Sync Greeting: Hello Sync World')
  })

  it('should recursively parse nested synchronous shortcodes', () => {
    shortcodes.addShortcode({ shortcode: 'outer', handler: ({ content }) => `<outer>${content}</outer>` })
    shortcodes.addShortcode({ shortcode: 'inner', handler: ({ content }) => `<inner>${content}</inner>` })
    const result = shortcodes.parseStringSync('[@outer][@inner]content[/@inner][/@outer]')
    expect(result.text).toBe('<outer><inner>content</inner></outer>')
  })

  it('should handle shortcodes with attributes in sync mode', () => {
    shortcodes.addShortcode({ shortcode: 'attr', handler: ({ attributes }) => `Attribute: ${attributes?.value}` })
    const result = shortcodes.parseStringSync('[@attr value="test"]')
    expect(result.text).toBe('Attribute: test')
  })

  it('should throw an error when encountering an async shortcode in sync mode', () => {
    shortcodes.addShortcode({ shortcode: 'asyncShortcode', handler: async () => 'Async Result' })
    expect(() => {
      shortcodes.parseStringSync('This will fail: [@asyncShortcode]')
    }).toThrow('Synchronous parsing is not possible when async shortcodes are present')
  })

  it('should handle multiple shortcodes in a single string synchronously', () => {
    shortcodes.addShortcode({ shortcode: 'one', handler: () => '1' })
    shortcodes.addShortcode({ shortcode: 'two', handler: () => '2' })
    const result = shortcodes.parseStringSync('Count: [@one] [@two] [@one]')
    expect(result.text).toBe('Count: 1 2 1')
  })

  it('should ignore unrecognized shortcodes in sync mode', () => {
    const result = shortcodes.parseStringSync('This [@unknown] shortcode will be ignored')
    expect(result.text).toBe('This [@unknown] shortcode will be ignored')
  })

  it('should handle escaped shortcodes in sync mode', () => {
    const result = shortcodes.parseStringSync('This \\[@escaped] is not a shortcode')
    expect(result.text).toBe('This [@escaped] is not a shortcode')
  })

  it('should process shortcodes with empty content in sync mode', () => {
    shortcodes.addShortcode({ shortcode: 'empty', handler: ({ content }) => `Empty: "${content}"` })
    // Update to use the new [@] syntax
    const result = shortcodes.parseStringSync('[@empty][/@empty]')
    expect(result.text).toBe('Empty: ""')
  })

  it('should handle complex nested structures synchronously', () => {
    shortcodes.addShortcode({ shortcode: 'list', handler: ({ content }) => `<ul>${content}</ul>` })
    shortcodes.addShortcode({ shortcode: 'item', handler: ({ content }) => `<li>${content}</li>` })
    const input = '[@list][@item]First[/@item][@item]Second[/@item][/@list]'
    const result = shortcodes.parseStringSync(input)
    expect(result.text).toBe('<ul><li>First</li><li>Second</li></ul>')
  })
})

const mockProcessor: Processor<string> = {
  condition: async ({ key, value }): Promise<boolean> => key === 'testKey' && typeof value === 'string',
  action: async (value: string): Promise<string> => `processed-${value}`,
}

describe('objectProcessor', () => {
  it('should process an object with a single key-value pair', async () => {
    const processor = new ObjectProcessor()
    processor.addProcessor(mockProcessor)

    const obj = { testKey: 'value' }
    const processedObj = await processor.parseObject(obj)

    expect(processedObj).toEqual({ testKey: 'processed-value' })
  })

  it('should handle nested objects', async () => {
    const processor = new ObjectProcessor()
    processor.addProcessor(mockProcessor)

    const obj = { nested: { testKey: 'value' } }
    const processedObj = await processor.parseObject(obj)

    expect(processedObj).toEqual({ nested: { testKey: 'processed-value' } })
  })

  it('should process arrays within objects', async () => {
    const processor = new ObjectProcessor()
    processor.addProcessor(mockProcessor)

    const obj = { array: [{ testKey: 'value1' }, { testKey: 'value2' }] }
    const processedObj = await processor.parseObject(obj)

    expect(processedObj).toEqual({ array: [{ testKey: 'processed-value1' }, { testKey: 'processed-value2' }] })
  })

  it('should ignore keys that do not meet the condition', async () => {
    const processor = new ObjectProcessor()
    processor.addProcessor(mockProcessor)

    const obj = { otherKey: 'value', testKey: 'value' }
    const processedObj = await processor.parseObject(obj)

    expect(processedObj).toEqual({ otherKey: 'value', testKey: 'processed-value' })
  })

  it('should handle objects without any applicable processors', async () => {
    const processor = new ObjectProcessor()
    processor.addProcessor(mockProcessor)

    const obj = { anotherKey: 'value' }
    const processedObj = await processor.parseObject(obj)

    expect(processedObj).toEqual({ anotherKey: 'value' })
  })

  it('should correctly process with multiple processors', async () => {
    const processor1: Processor<string> = {
      condition: async ({ key }) => key === 'testKey',
      action: async value => `processor1-${value}`,
    }
    const processor2: Processor<string> = {
      condition: async ({ key }) => key === 'otherKey',
      action: async value => `processor2-${value}`,
    }

    const objectProcessor = new ObjectProcessor()
    objectProcessor.addProcessor(processor1)
    objectProcessor.addProcessor(processor2)

    const obj = { testKey: 'value1', otherKey: 'value2' }
    const processedObj = await objectProcessor.parseObject(obj)

    expect(processedObj).toEqual({ testKey: 'processor1-value1', otherKey: 'processor2-value2' })
  })

  it('should handle errors in processors gracefully', async () => {
    const errorProcessor: Processor = {
      condition: async ({ key }) => key === 'testKey',
      action: async () => { throw new Error('IGNORE THIS ERROR: Error Created For Test') },
    }

    const objectProcessor = new ObjectProcessor()
    objectProcessor.addProcessor(errorProcessor)

    const obj = { testKey: 'value' }
    let error = null
    try {
      await objectProcessor.parseObject(obj)
    }
    catch (e) {
      error = e as Error
    }

    expect(error).toBeNull()
  })

  it('should skip processing when the processor decides to pass through', async () => {
    const passThroughProcessor: Processor = {
      condition: async ({ key }) => key === 'testKey',
      action: async value => value, // Simply returns the original value
    }

    const processor = new ObjectProcessor()
    processor.addProcessor(passThroughProcessor)

    const obj = { testKey: 'value' }
    const processedObj = await processor.parseObject(obj)

    expect(processedObj).toEqual({ testKey: 'value' })
  })

  it('should correctly handle an object when no processors are added', async () => {
    const processor = new ObjectProcessor()
    const obj = { someKey: 'someValue' }
    const processedObj = await processor.parseObject(obj)

    expect(processedObj).toEqual({ someKey: 'someValue' })
  })

  it('should retain the array structure within objects', async () => {
    const processor = new ObjectProcessor()
    processor.addProcessor(mockProcessor)
    const obj = { array: ['value1', 'value2', { testKey: 'value' }] }
    const processedObj = await processor.parseObject(obj)

    expect(Array.isArray(processedObj.array)).toBeTruthy()
    expect(processedObj.array.length).toBe(3)
    expect(processedObj.array[2]).toEqual({ testKey: 'processed-value' }) // Assuming 'testKey' gets processed
  })

  it('should process nested arrays correctly', async () => {
    const processor = new ObjectProcessor()
    processor.addProcessor(mockProcessor)

    const obj = { nested: { array: [{ testKey: 'value1' }, 'value2'] } }
    const processedObj = await processor.parseObject(obj)

    expect(Array.isArray(processedObj.nested.array)).toBeTruthy()
    expect(processedObj.nested.array).toEqual([{ testKey: 'processed-value1' }, 'value2'])
  })

  it('should handle arrays of primitive values correctly', async () => {
    const processor = new ObjectProcessor()
    const obj = { numbers: [1, 2, 3], strings: ['a', 'b', 'c'] }
    const processedObj = await processor.parseObject(obj)

    expect(Array.isArray(processedObj.numbers)).toBeTruthy()
    expect(processedObj.numbers).toEqual([1, 2, 3])
    expect(Array.isArray(processedObj.strings)).toBeTruthy()
    expect(processedObj.strings).toEqual(['a', 'b', 'c'])
  })
})

// Testing property removal on error
it('should remove properties that cause processing errors', async () => {
  const errorGeneratingProcessor: Processor = {
    condition: async ({ value }) => typeof value === 'string' && value.includes('error'),
    // @ts-expect-error test
    action: (value: string) => {
      throw new Error(`[IGNORE] Processing error for value: ${value}`)
    },
  }

  const objectProcessor = new ObjectProcessor([errorGeneratingProcessor])

  const obj = {
    safeKey: 'safeValue',
    errorKey: 'generate error',
  }

  const processedObj = await objectProcessor.parseObject(obj)

  // Expect the object to retain 'safeKey' and exclude 'errorKey'
  expect(processedObj).toEqual({ safeKey: 'safeValue' })
  expect(processedObj).not.toHaveProperty('errorKey')
})

// Testing graceful error handling
it('should not throw and continue processing when an error occurs', async () => {
  const failingProcessor: Processor = {
    condition: async ({ key }) => key === 'fail',
    action: async () => {
      throw new Error('[IGNORE] Failed processing')
    },
  }

  const passingProcessor: Processor<string> = {
    condition: async ({ key }) => key === 'pass',
    action: async value => `processed-${value}`,
  }

  const objectProcessor = new ObjectProcessor()
  objectProcessor.addProcessor(failingProcessor)
  objectProcessor.addProcessor(passingProcessor)

  const obj = {
    fail: 'will fail',
    pass: 'will pass',
  }

  const processedObj = await objectProcessor.parseObject(obj)

  // 'fail' key should be removed due to processing error, 'pass' should be processed successfully
  expect(processedObj).toEqual({ pass: 'processed-will pass' })
})
