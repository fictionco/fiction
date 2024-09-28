import { describe, expect, it } from 'vitest'
import { type EditorSupplementary, generateAutocompleteObjectives, shouldSuggest } from '../utils/editor.js'

describe('generateAutocompleteObjectives', () => {
  it('should generate objectives based on supplementary information', () => {
    const supplementary: EditorSupplementary = {
      title: 'Test Title',
      subTitle: 'Test Subtitle',
      outline: 'Test Outline',
      description: 'Test Description',
      tags: ['tag1', 'tag2'],
      category: 'Test Category',
      keywords: ['keyword1', 'keyword2'],
    }

    const objectives = generateAutocompleteObjectives(supplementary)

    expect(objectives.title).toMatchInlineSnapshot(`"Reference title of content: Test Title"`)
    expect(objectives.subTitle).toMatchInlineSnapshot(`"Consider the subtitle: Test Subtitle"`)
    expect(objectives.outline).toMatchInlineSnapshot(`"Follow the general outline: Test Outline"`)
    expect(objectives.description).toMatchInlineSnapshot(`"Keep in mind the overall description: Test Description"`)
    expect(objectives.tags).toMatchInlineSnapshot(`"Incorporate relevant concepts from these tags: tag1, tag2"`)
    expect(objectives.category).toMatchInlineSnapshot(`"Align content with the category: Test Category"`)
    expect(objectives.keywords).toMatchInlineSnapshot(`"Incorporate these key SEO terms naturally: keyword1, keyword2"`)
    expect(objectives.general).toBeDefined()
  })

  it('should not generate objectives for missing information', () => {
    const supplementary: EditorSupplementary = {
      title: 'Test Title',
    }

    const objectives = generateAutocompleteObjectives(supplementary)

    expect(objectives.title).toBeDefined()
    expect(objectives.subTitle).toBeUndefined()
    expect(objectives.outline).toBeUndefined()
    expect(objectives.description).toBeUndefined()
    expect(objectives.tags).toBeUndefined()
    expect(objectives.category).toBeUndefined()
    expect(objectives.keywords).toBeUndefined()
    expect(objectives.general).toBeDefined()
  })

  it('should not generate any objectives for empty supplementary', () => {
    const supplementary: EditorSupplementary = {}

    const objectives = generateAutocompleteObjectives(supplementary)

    expect(Object.keys(objectives).length).toBe(0)
  })
})

describe('shouldSuggest function', () => {
  it('should suggest when all conditions are met', () => {
    const result = shouldSuggest({
      previousText: 'This is a complete sentence. ',
      nextText: '\n',
    })
    expect(result.status, 'Should return success status when all conditions are met').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should not suggest when there is no sentence-ending punctuation', () => {
    const result = shouldSuggest({
      previousText: 'This is an incomplete sentence ',
      nextText: '\n',
    })
    expect(result.status, 'Should return error status when missing punctuation').toBe('error')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should not suggest when the next text is not empty or a new line', () => {
    const result = shouldSuggest({
      previousText: 'This is a complete sentence. ',
      nextText: 'More text follows',
    })
    expect(result.status, 'Should return error status when next text is not empty or newline').toBe('error')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should not suggest when there is insufficient context', () => {
    const result = shouldSuggest({
      previousText: 'Hi. ',
      nextText: '\n',
    })
    expect(result.status, 'Should return error status when context is too short').toBe('error')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest with comma as clause break', () => {
    const result = shouldSuggest({
      previousText: 'After a clause, ',
      nextText: '\n',
    })
    expect(result.status, 'Should return success status with comma').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest with semicolon as clause break', () => {
    const result = shouldSuggest({
      previousText: 'First part; ',
      nextText: '\n',
    })
    expect(result.status, 'Should return success status with semicolon').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest when next text is empty string', () => {
    const result = shouldSuggest({
      previousText: 'End of text. ',
      nextText: '',
    })
    expect(result.status, 'Should return success status with empty next text').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should not suggest with only spaces after punctuation', () => {
    const result = shouldSuggest({
      previousText: 'Sentence.    ',
      nextText: 'More text',
    })
    expect(result.status, 'Should return error status with spaces after punctuation').toBe('error')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest with multiple spaces before newline', () => {
    const result = shouldSuggest({
      previousText: 'Multiple spaces.   ',
      nextText: '\n',
    })
    expect(result.status, 'Should return success status with multiple spaces before newline').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })
})
