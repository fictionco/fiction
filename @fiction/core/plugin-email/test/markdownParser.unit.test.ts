import { describe, expect, it } from 'vitest'
import { renderEmailHtmlFromMarkdown } from '../markdownParser'

describe('renderEmailHtmlFromMarkdown', () => {
  // Test basic setup and empty cases
  it('handles null/undefined input', () => {
    expect(renderEmailHtmlFromMarkdown(null)).toBe('')
    expect(renderEmailHtmlFromMarkdown(undefined)).toBe('')
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

    expect(html).toContain('<ul style="margin: 0 0 1em; padding-left: 24px;">')
    expect(html).toContain('<ol style="margin: 0 0 1em; padding-left: 24px;">')
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

    expect(html).toContain('<blockquote style="margin: 1em 0 1em 1em; padding: 0.5em 1em; border-left:')
  })

  // Test code blocks
  it('renders code blocks with proper formatting', () => {
    const markdown = '```\nconst x = 1;\n```'
    const html = renderEmailHtmlFromMarkdown(markdown)

    expect(html).toContain('<pre style="margin: 1em 0; padding: 1em; background: #e6e9f1;')
  })

  // Test custom options
  it('applies custom styling options', () => {
    const options = {
      theme: 'cyan' as const,
      headerFont: 'Arial',
      bodyFont: 'Georgia',
      baseUrl: 'https://test.com',
    }

    const markdown = '# Title\nParagraph with [link](/page)'
    const html = renderEmailHtmlFromMarkdown(markdown, options)

    expect(html).toContain('font-family: Arial')
    expect(html).toContain('font-family: Georgia')
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
})
