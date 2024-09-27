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

describe('shouldSuggest', () => {
  it('should suggest at the end of a sentence', () => {
    expect(shouldSuggest('This is a sentence.', '')).toBe(true)
  })

  it('should suggest after a colon', () => {
    expect(shouldSuggest('This is a list:', '')).toBe(true)
  })

  it('should suggest for a new list item', () => {
    expect(shouldSuggest('- ', '')).toBe(true)
    expect(shouldSuggest('1. ', '')).toBe(true)
  })

  it('should suggest after a comma if next word hasn\'t started', () => {
    expect(shouldSuggest('This is a phrase,', ' ')).toBe(true)
    expect(shouldSuggest('This is a phrase,', 'next')).toBe(false)
  })

  it('should suggest in the middle of a sentence if next word hasn\'t started', () => {
    expect(shouldSuggest('This is an', ' ')).toBe(true)
    expect(shouldSuggest('This is an', 'unfinished')).toBe(false)
  })

  it('should not suggest for short text', () => {
    expect(shouldSuggest('Short', '')).toBe(false)
  })

  it('should not suggest if text ends with /', () => {
    expect(shouldSuggest('This ends with /', '')).toBe(false)
  })

  it('should not suggest if next word has started on the same line', () => {
    expect(shouldSuggest('This is a', 'continuation')).toBe(false)
  })

  it('should suggest if there\'s a line break', () => {
    expect(shouldSuggest('This is a line', '\nNew line')).toBe(true)
  })
})
