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
}) // Adjust the import path as necessary

describe('shouldSuggest function', () => {
  it('should suggest when at the end of a word mid-sentence', () => {
    const result = shouldSuggest({
      previousText: 'This is a sentence',
      nextText: ' with more words',
    })
    expect(result.status, 'Should return success status when at the end of a word mid-sentence').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest when at the end of a word followed by a space', () => {
    const result = shouldSuggest({
      previousText: 'This is a sentence ',
      nextText: 'with more words',
    })
    expect(result.status, 'Should return success status when at the end of a word followed by a space').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest when on a new line, even without punctuation', () => {
    const result = shouldSuggest({
      previousText: 'This is a line without punctuation\n',
      nextText: '',
    })
    expect(result.status, 'Should return success status when on a new line without punctuation').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest when all conditions are met with punctuation', () => {
    const result = shouldSuggest({
      previousText: 'This is a complete sentence. ',
      nextText: '\n',
    })
    expect(result.status, 'Should return success status when all conditions are met').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should not suggest when in the middle of a word', () => {
    const result = shouldSuggest({
      previousText: 'This is an incomple',
      nextText: 'te word',
    })
    expect(result.status, 'Should return error status when in the middle of a word').toBe('error')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should not suggest when there is insufficient context', () => {
    const result = shouldSuggest({
      previousText: 'Hi',
      nextText: ' ',
    })
    expect(result.status, 'Should return error status when context is too short').toBe('error')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest with comma as clause break', () => {
    const result = shouldSuggest({
      previousText: 'After a clause,',
      nextText: ' more text',
    })
    expect(result.status, 'Should return success status with comma').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest when next text is empty string', () => {
    const result = shouldSuggest({
      previousText: 'End of text',
      nextText: '',
    })
    expect(result.status, 'Should return success status with empty next text').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })

  it('should suggest with multiple spaces after a word', () => {
    const result = shouldSuggest({
      previousText: 'Multiple spaces   ',
      nextText: 'continue',
    })
    expect(result.status, 'Should return success status with multiple spaces after a word').toBe('success')
    expect(result.message, 'Should return a string message').toBeTypeOf('string')
  })
})
