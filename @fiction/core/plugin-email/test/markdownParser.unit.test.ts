import { describe, expect, it } from 'vitest'
import { renderEmailHtmlFromMarkdown } from '../markdownParser'

describe('renderEmailHtmlFromMarkdown', () => {
  // Test basic setup and empty cases
  it('handles null/undefined input', () => {
    expect(renderEmailHtmlFromMarkdown(null)).toBe('')
    expect(renderEmailHtmlFromMarkdown(undefined)).toBe('')
    expect(renderEmailHtmlFromMarkdown('')).toBe('')
  })

  // Test basic text formatting
  it('renders basic text formatting correctly', () => {
    const markdown = '**bold** and *italic* and `code`'
    const html = renderEmailHtmlFromMarkdown(markdown)

    // The full HTML structure will include div wrapper and paragraph
    expect(html).toMatch(/font-weight: 600[^>]*>bold/) // Match bold styling and text
    expect(html).toMatch(/font-style: italic[^>]*>italic/) // Match italic styling and text
    expect(html).toMatch(/background: #e6e9f1[^>]*>code/) // Match code styling and text
  })

  // Test headings
  it('renders headings with correct styles', () => {
    const markdown = '# Heading 1\n## Heading 2'
    const html = renderEmailHtmlFromMarkdown(markdown)

    expect(html).toContain('<h1 style="margin: 1.5em 0 0.5em;')
    expect(html).toContain('<h2 style="margin: 1.5em 0 0.5em;')
  })

  // Test lists
  it('renders ordered and unordered lists', () => {
    const markdown = `
- Item 1
- Item 2

1. First
2. Second`
    const html = renderEmailHtmlFromMarkdown(markdown)

    expect(html).toContain('<ul style="margin: 0 0 1.5em; padding-left: 24px;">')
    expect(html).toContain('<ol style="margin: 0 0 1.5em; padding-left: 24px;">')
    expect(html).toContain('<li style="margin: 0.5em 0;')
  })

  // Test links and images
  it('renders links and images with proper attributes', () => {
    const markdown = '[Link](https://example.com)\n![Alt](https://example.com/img.jpg)'
    const html = renderEmailHtmlFromMarkdown(markdown, { baseUrl: 'https://base.com' })

    expect(html).toContain('<a href="https://example.com"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('<img src="https://example.com/img.jpg" alt="Alt"')
  })

  // Test blockquotes
  it('renders blockquotes with styling', () => {
    const markdown = '> A quoted text\n> Another line'
    const html = renderEmailHtmlFromMarkdown(markdown)

    expect(html).toContain('<blockquote style="margin:')
  })

  // Test code blocks
  it('renders code blocks with proper formatting', () => {
    const markdown = '```\nconst x = 1;\n```'
    const html = renderEmailHtmlFromMarkdown(markdown)

    expect(html).toContain('<pre style="margin: 1.5em 0; padding: 1em; background: #e6e9f1;')
  })

  // Test custom options
  it('applies custom styling options', () => {
    const options = {
      theme: 'cyan' as const,
      baseUrl: 'https://test.com',
    }

    const markdown = '# Title\nParagraph with [link](/page)'
    const html = renderEmailHtmlFromMarkdown(markdown, options)

    expect(html).toContain('color: #06b6d4')
    expect(html).toContain('href="https://test.com/page"')
  })

  // Test complex mixed content
  it('handles complex mixed markdown content', () => {
    const markdown = `
# Main Title

## Section with *emphasis*

- List item with [link](https://test.com)
- Item with \`code\`

> Blockquote with **bold**

\`\`\`
code block
\`\`\`
`
    const html = renderEmailHtmlFromMarkdown(markdown)

    expect(html).toContain('<h1')
    expect(html).toContain('<h2')
    expect(html).toContain('<em')
    expect(html).toContain('<strong')
    expect(html).toContain('<ul')
    expect(html).toContain('<blockquote')
    expect(html).toContain('<pre')
    expect(html).toContain('<code')
  })

  // Image rendering tests
  describe('image rendering', () => {
    it('renders absolute URLs without modification', () => {
      const markdown = '![Alt text](https://example.com/image.jpg)'
      const html = renderEmailHtmlFromMarkdown(markdown)

      expect(html).toContain('<img src="https://example.com/image.jpg"')
      expect(html).toContain('alt="Alt text"')
      expect(html).toContain('style="max-width: 100%; height: auto; margin: 1em 0;"')
    })

    it('prepends baseUrl to relative image paths', () => {
      const markdown = '![Alt text](/images/local.jpg)'
      const html = renderEmailHtmlFromMarkdown(markdown, { baseUrl: 'https://base.com' })

      expect(html).toContain('<img src="https://base.com/images/local.jpg"')
    })

    it('handles images within paragraphs', () => {
      const markdown = 'Text before ![Alt text](image.jpg) text after'
      const html = renderEmailHtmlFromMarkdown(markdown, { baseUrl: 'https://base.com' })

      expect(html).toContain('<p style="margin: 0 0 1.5em;')
      expect(html).toContain('<img src="https://base.com/image.jpg"')
    })

    it('handles multiple images', () => {
      const markdown = `
![First](first.jpg)
Some text
![Second](second.jpg)
`
      const html = renderEmailHtmlFromMarkdown(markdown, { baseUrl: 'https://base.com' })

      expect(html).toMatch(/first\.jpg.*second\.jpg/s)
      expect((html.match(/img/g) || []).length).toBe(2)
    })

    it('preserves image attributes in complex markdown', () => {
      const markdown = `
# Header
![Image 1](img1.jpg)
> Quote with ![Image 2](img2.jpg)
* List with ![Image 3](img3.jpg)
`
      const html = renderEmailHtmlFromMarkdown(markdown, { baseUrl: 'https://cdn.com/' })

      expect(html).toContain('src="https://cdn.com/img1.jpg"')
      expect(html).toContain('src="https://cdn.com/img2.jpg"')
      expect(html).toContain('src="https://cdn.com/img3.jpg"')
    })
  })

  // Link rendering tests
  describe('link rendering', () => {
    it('handles absolute and relative links correctly', () => {
      const markdown = `
[Absolute](https://example.com)
[Relative](/page)
`
      const html = renderEmailHtmlFromMarkdown(markdown, { baseUrl: 'https://base.com' })

      expect(html).toContain('href="https://example.com"')
      expect(html).toContain('href="https://base.com/page"')
      expect(html).toMatch(/text-decoration: underline/g)
    })

    it('applies correct styling to links', () => {
      const markdown = '[Link](https://test.com)'
      const html = renderEmailHtmlFromMarkdown(markdown, { theme: 'blue' })

      expect(html).toContain('style="color: #3b82f6; text-decoration: underline;"')
      expect(html).toContain('target="_blank"')
    })
  })

  // Text formatting tests
  describe('text formatting', () => {
    it('renders inline styles correctly', () => {
      const markdown = '**bold** *italic* `code`'
      const html = renderEmailHtmlFromMarkdown(markdown)

      expect(html).toMatch(/font-weight: 600[^>]*>bold/)
      expect(html).toMatch(/font-style: italic[^>]*>italic/)
      expect(html).toMatch(/font-family: monaco[^>]*>code/)
    })

    it('handles nested formatting', () => {
      const markdown = '**bold _italic_ text**'
      const html = renderEmailHtmlFromMarkdown(markdown)

      expect(html).toContain('<strong style="font-weight: 600;">')
      expect(html).toContain('<em style="font-style: italic;">')
    })
  })

  // Block element tests
  describe('block elements', () => {
    it('formats blockquotes correctly', () => {
      const markdown = '> First paragraph\n>\n> Second paragraph'
      const html = renderEmailHtmlFromMarkdown(markdown)

      expect(html).toContain('<blockquote style="margin: 1.5em 0 1.5em 1em;')
      expect(html).toMatch(/border-left: 4px solid/)
      expect(html).toMatch(/First paragraph.*Second paragraph/s)
    })

    it('handles nested lists properly', () => {
      const markdown = `
* Level 1
  * Level 2
    * Level 3
`
      const html = renderEmailHtmlFromMarkdown(markdown)
      const listItems = (html.match(/<li/g) || []).length

      expect(listItems).toBe(3)
      expect(html).toContain('padding-left: 24px')
    })
  })

  // Theme and custom options tests
  describe('theme and custom options', () => {
    it('applies theme colors correctly', () => {
      const markdown = '[Link](https://test.com)'
      const html = renderEmailHtmlFromMarkdown(markdown, {
        theme: 'emerald',
        previewMode: 'light',
      })

      expect(html).toContain('color: #10b981')
    })
  })
})
