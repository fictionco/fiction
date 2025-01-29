import type { EditorSupplementary } from '../utils/editor.js'

import { describe, expect, it } from 'vitest'
import { generateAutocompleteObjectives, shouldSuggest } from '../utils/editor.js'

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
  it('should not suggest when in middle of text, even at word boundaries', () => {
    const result = shouldSuggest({
      previousText: 'This is a sentence',
      nextText: ' with more words',
    })
    expect(result.status, 'Should return error status when in middle of text').toBe('error')
    expect(result.message).toContain('not at a valid suggestion point')
  })

  it('should not suggest with space between words mid-text', () => {
    const result = shouldSuggest({
      previousText: 'This is a sentence ',
      nextText: 'with more words',
    })
    expect(result.status, 'Should return error status when between words').toBe('error')
    expect(result.message).toContain('not at a valid suggestion point')
  })

  it('should suggest when at a new line', () => {
    const result = shouldSuggest({
      previousText: 'This is a complete line.\n',
      nextText: '',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "isAtNewLine": true,
          "nextParagraphLength": 0,
        },
        "message": "Suggesting(new line): cursor is at a new line",
        "status": "success",
      }
    `)
    expect(result.status, 'Should return success status at new line').toBe('success')
    expect(result.message).toContain('new line')
  })

  it('should suggest at end of line with no text before next paragraph', () => {
    const result = shouldSuggest({
      previousText: 'This is a complete line.',
      nextText: '   \nNext paragraph starts here',
    })
    expect(result.status, 'Should return success at end of line before paragraph').toBe('success')
    expect(result.message).toContain('end of a line')
  })

  it('should not suggest when in the middle of a word', () => {
    const result = shouldSuggest({
      previousText: 'This is incomple',
      nextText: 'te text',
    })
    expect(result.status, 'Should return error status in middle of word').toBe('error')
    expect(result.message).toContain('middle of a word')
  })

  it('should not suggest with insufficient context', () => {
    const result = shouldSuggest({
      previousText: 'Hi',
      nextText: ' there',
    })
    expect(result.status, 'Should return error status with short context').toBe('error')
    expect(result.message).toContain('insufficient context')
  })

  it('should not suggest with comma in middle of text', () => {
    const result = shouldSuggest({
      previousText: 'After a clause,',
      nextText: ' more text continues',
    })
    expect(result.status, 'Should return error status with comma mid-text').toBe('error')
    expect(result.message).toContain('not at a valid suggestion point')
  })

  it('should suggest at true end of text', () => {
    const result = shouldSuggest({
      previousText: 'This is the end of the text.',
      nextText: '',
    })
    expect(result.status, 'Should return success at true end of text').toBe('success')
    expect(result.message).toContain('end of a line')
  })

  it('should not suggest with multiple spaces between words', () => {
    const result = shouldSuggest({
      previousText: 'Multiple spaces   ',
      nextText: 'continue here',
    })
    expect(result.status, 'Should return error status with spaces between words').toBe('error')
    expect(result.message).toContain('not at a valid suggestion point')
  })

  it('should suggest with proper minimum context at new line', () => {
    const result = shouldSuggest({
      previousText: 'This is enough context for suggestion.\n',
      nextText: '',
      minContextLength: 12,
    })
    expect(result.status, 'Should return success with sufficient context at new line').toBe('success')
    expect(result.message).toContain('new line')
  })

  it('should suggest at end of paragraph with next paragraph', () => {
    const result = shouldSuggest({
      previousText: 'End of first paragraph.',
      nextText: '\nStart of second paragraph.',
    })
    expect(result.status, 'Should return success at paragraph boundary').toBe('success')
    expect(result.message).toContain('end of a line')
  })

  it('should handle custom minimum context length', () => {
    const result = shouldSuggest({
      previousText: 'Short.',
      nextText: '\nNext line',
      minContextLength: 20,
    })
    expect(result.status, 'Should return error with custom minimum context').toBe('error')
    expect(result.message).toContain('insufficient context')
  })
})
