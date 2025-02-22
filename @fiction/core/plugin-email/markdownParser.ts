import type { RendererObject, Token } from 'marked'
import { colorList } from '@fiction/core/utils/colors.js'
import { marked } from 'marked'

export type EmailMarkdownOptions = {
  primaryColor?: string
  headerFont?: string
  bodyFont?: string
  baseUrl?: string
  baseFontSize?: number
  previewMode?: 'dark' | 'light' | ''
  theme?: keyof typeof colorList
}

const fonts = {
  standard: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
  mono: 'monaco, Consolas, "Lucida Console", monospace',
}

// Used to help custom formatting in block elements
// to prevent paragraphs from having margin on the last paragraph, etc.
const renderContext = {
  inBlockquote: false,
  paragraphCount: 0,
  totalParagraphs: 0,
}

// First pass to count paragraphs in blockquotes
function countParagraphs(tokens: Token[]) {
  let count = 0
  for (const token of tokens) {
    if (token.type === 'paragraph')
      count++
  }
  return count
}

export function renderEmailHtmlFromMarkdown(markdown: string | null | undefined, options: EmailMarkdownOptions = {}): string {
  if (!markdown) {
    return ''
  }
  const bodyFont = options.bodyFont || fonts.standard
  const headerFont = options.headerFont || bodyFont
  const baseFontSize = options.baseFontSize || 16
  const { previewMode, theme } = options

  const primaryColorScheme = theme ? colorList[theme] : colorList.blue
  const elementColorScheme = colorList.gray

  const colors = {
    border: previewMode === 'dark' ? elementColorScheme[600] : elementColorScheme[200],
    panel: previewMode === 'dark' ? elementColorScheme[700] : elementColorScheme[100],
    link: previewMode === 'dark' ? primaryColorScheme[400] : primaryColorScheme[500],
  }

  const renderer: RendererObject = {
    strong({ tokens }) {
      return `<strong style="font-weight: 600;">${this.parser.parseInline(tokens)}</strong>`
    },
    em({ tokens }) {
      return `<em style="font-style: italic;">${this.parser.parseInline(tokens)}</em>`
    },
    code({ text }) {
      return `<pre style="margin: 1.5em 0; padding: 1em; background: ${colors.panel}; border-radius: 4px; font-family: monaco, Consolas, 'Lucida Console', monospace; font-size: 14px; line-height: 1.4; overflow-x: auto;"><code>${text}</code></pre>`
    },
    codespan({ text }) {
      return `<code style="padding: 0.2em 0.4em; background: ${colors.panel}; border-radius: 3px; font-family: monaco, Consolas, 'Lucida Console', monospace; font-size: 85%;">${text}</code>`
    },
    image({ href, text }) {
      const src = href.startsWith('http') ? href : `${options.baseUrl}${href}`
      return `<img src="${src}" alt="${text}" style="max-width: 100%; height: auto; margin: 1em 0;" />`
    },
    link({ href, tokens }) {
      const linkHref = href.startsWith('http') ? href : `${options.baseUrl}${href}`
      return `<a href="${linkHref}" style="color: ${colors.link}; text-decoration: underline;" target="_blank">${this.parser.parseInline(tokens)}</a>`
    },
    hr() {
      return `<hr style="margin: 2em 0; border: 0; border-top: 1px solid ${colors.border};" />`
    },
    blockquote({ tokens }) {
      renderContext.inBlockquote = true
      renderContext.paragraphCount = 0
      renderContext.totalParagraphs = countParagraphs(tokens)

      const result = `<blockquote style="margin: 1.5em 0 1.5em 1em; padding: 0.5em 0 0.5em 1.5em; font-size: 1.2em; border-left: 4px solid ${colors.border}; ">
       ${this.parser.parse(tokens)}
      </blockquote>`

      renderContext.inBlockquote = false
      return result
    },
    listitem({ tokens }) {
      return `<li style="margin: 0.5em 0; font-size: ${baseFontSize}px; line-height: 1.6;">${this.parser.parse(tokens)}</li>`
    },
    list({ ordered, items }) {
      const type = ordered ? 'ol' : 'ul'
      const style = 'margin: 0 0 1.5em; padding-left: 24px;'
      return `<${type} style="${style}">${items.map(item => this.listitem(item)).join('')}</${type}>`
    },
    paragraph({ tokens }) {
      let marginStyle = 'margin: 0 0 1.5em;'

      if (renderContext.inBlockquote) {
        renderContext.paragraphCount++

        if (renderContext.paragraphCount === 1) {
          // First paragraph in blockquote
          marginStyle = 'margin: 0 0 1.5em;'
        }
        else if (renderContext.paragraphCount === renderContext.totalParagraphs) {
          // Last paragraph in blockquote
          marginStyle = 'margin: 0;'
        }
      }

      return `<p style="${marginStyle} font-size: ${baseFontSize}px; line-height: 1.6;">${this.parser.parseInline(tokens)}</p>`
    },
    heading({ tokens, depth }) {
      const size = Math.max(28 - (depth * 4), baseFontSize) // Scale heading sizes
      const lineHeight = 1.2 + (0.1 * (depth - 1)) // Scale line height
      return `<h${depth} style="margin: 1.5em 0 0.5em; font-size: ${size}px; line-height: ${lineHeight};">${this.parser.parseInline(tokens)}</h${depth}>`
    },
  }

  marked.use({ renderer })

  const htmlContent = marked.parse(markdown, {
    breaks: true, // Convert line breaks
    pedantic: false,
    gfm: true,
    silent: false,
  })

  return (htmlContent as string).trim()
}
