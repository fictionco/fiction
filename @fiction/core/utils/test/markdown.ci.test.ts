import { describe, expect, it } from 'vitest'
import { excerpt, renderMarkdown, stripMarkdown, toHtml, toMarkdown } from '../markdown'

describe('toHtml (Markdown to HTML)', () => {
  it('converts basic markdown to HTML', () => {
    const markdown = '**bold** and _italic_'
    const html = '<p><strong>bold</strong> and <em>italic</em></p>'
    expect(toHtml(markdown)).toMatchInlineSnapshot(`"<p><strong>bold</strong> and <em>italic</em></p>"`)
    expect(toHtml(markdown)).toBe(html)
  })

  it('converts markdown headers to HTML headers', () => {
    const markdown = '# Header 1\n## Header 2'
    const html = '<h1 id="header-1">Header 1</h1>\n<h2 id="header-2">Header 2</h2>'
    expect(toHtml(markdown)).toBe(html)
  })

  // Add more tests for lists, links, images, etc.

  it('returns an empty string when provided an empty input', () => {
    const markdown = ''
    const html = ''
    expect(toHtml(markdown)).toBe(html)
  })

  it('handles null or undefined input gracefully', () => {
    // @ts-expect-error test
    expect(toHtml(null)).toBe('')
    expect(toHtml(undefined)).toBe('')
  })

  // Add tests for any edge cases or specific behavior of your Markdown parser
})

describe('toMarkdown (HTML to Markdown)', () => {
  it('converts basic HTML to markdown', () => {
    const html = '<strong>bold</strong> and <em>italic</em>'
    const markdown = '**bold** and _italic_'
    expect(toMarkdown(html)).toBe(markdown)
  })

  it('converts HTML headers to markdown headers', () => {
    const html = '<h1>Header 1</h1><h2>Header 2</h2>'
    const markdown = '# Header 1\n\n## Header 2'
    expect(toMarkdown(html)).toBe(markdown)
  })

  // Add more tests for lists, links, images, etc.

  it('returns an empty string when provided an empty input', () => {
    const html = ''
    const markdown = ''
    expect(toMarkdown(html)).toBe(markdown)
  })

  it('handles null or undefined input gracefully', () => {
    // @ts-expect-error test
    expect(toMarkdown(null)).toBe('')
    // @ts-expect-error test
    expect(toMarkdown(undefined)).toBe('')
  })

  // Add tests for any edge cases or specific behavior of your HTML to Markdown parser
})

describe('renderMarkdown', () => {
  it('should convert basic markdown text to HTML', async () => {
    const input = 'This is **bold** and this is _italic_.'
    const output = '<p>This is <strong>bold</strong> and this is <em>italic</em>.</p>'
    expect(await renderMarkdown(input)).toBe(output)
  })

  it('should handle markdown headers correctly', async () => {
    const input = '# Header 1\n## Header 2'
    const output = '<h1 id="header-1">Header 1</h1>\n<h2 id="header-2">Header 2</h2>'
    expect(await renderMarkdown(input)).toBe(output)
  })

  it('should convert markdown lists to HTML lists', async () => {
    const input = '* Item 1\n* Item 2\n* Item 3'
    const output = '<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n</ul>'
    expect(await renderMarkdown(input)).toBe(output)
  })

  it('should return an empty string for non-string inputs', async () => {
    const input = null
    expect(await renderMarkdown(input as unknown as undefined)).toBe('')
  })

  it('should handle links in markdown', async () => {
    const input = '[OpenAI](https://www.openai.com/)'
    const output = '<p><a href="https://www.openai.com/">OpenAI</a></p>'
    const md = await renderMarkdown(input)

    expect(md).toMatchInlineSnapshot(`"<p><a href="https://www.openai.com/">OpenAI</a></p>"`)
    expect(md).toBe(output)
  })

  // Add more tests for other markdown elements like images, blockquotes, code blocks, etc.

  // Testing with options if your MarkdownOptions affect the output significantly
  it('should apply options if provided', async () => {
    const input = '## Header with *style*'
    // Expected output based on the options
    const output = '<h2 id="header-with-style">Header with <em>style</em></h2>'
    expect(await renderMarkdown(input)).toBe(output)
  })

  // Add tests for any edge cases or specific behavior of your Markdown parser
})

describe('stripMarkdown', () => {
  it('should remove markdown formatting from text', () => {
    const input = '# Heading\n\nSome *bold* text'
    const output = 'Heading\n\nSome bold text'
    expect(stripMarkdown(input)).toBe(output)
  })

  // Add more tests for different markdown scenarios
})

describe('excerpt', () => {
  it('should shorten text to default length and remove markdown', () => {
    const input = '# Heading\n\nSome *bold* text and more content here'
    const output = 'Heading Some bold text and...'
    expect(excerpt(input, { length: 5 })).toBe(output)
  })

  it('should shorten text to specified length', () => {
    const input = 'This is a test sentence for excerpt function.'
    const length = 5
    const output = 'This is a test sentence...'
    expect(excerpt(input, { length })).toBe(output)
  })

  it('should return empty string for empty input', () => {
    expect(excerpt('')).toBe('')
  })

  // Add more tests for edge cases, like very long input, no markdown content, etc.
})
