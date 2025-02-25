import type { MarkedOptions } from 'marked'
import type TurndownService from 'turndown'
import type { Component } from 'vue'

import Frontmatter from 'front-matter'
import removeMarkdownUtility from 'remove-markdown'

import { fastHash } from './utils'

export type PostOrPage = {
  postId?: string
  title?: string
  description?: string
  permalink?: string
  route?: string
  excerpt?: string
  publishedAt?: string
  category?: string[]
  authorName?: string
  authorEmail?: string
  imageUrl?: string
  imageCaption?: string
  bodyHtml?: string
  bodyMarkdown?: string
  VueComponent?: Component
  VueComponentWith?: (c: Record<string, Component>) => Component
}
export interface MarkdownFile {
  bodyHtml: string
  bodyMarkdown: string
  VueComponent: Component
  VueComponentWith: (c: Record<string, Component>) => Component
  attributes: PostOrPage
}

type MarkdownOptions = MarkedOptions & {
  async: true
}

export async function getMarkdownUtility() {
  const { marked } = await import('marked')
  const { gfmHeadingId } = await import('marked-gfm-heading-id')
  marked.use({ gfm: true })
  marked.use(gfmHeadingId())
  return marked
}

export async function toHtml(markdown?: string) {
  const util = await getMarkdownUtility()

  const result = util.parse(markdown || '')

  return (result as string).trim()
}

export async function toMarkdown(html: string, options: TurndownService.Options & { keep?: (keyof HTMLElementTagNameMap)[] } = {}) {
  if (!html)
    return ''

  const { default: TurndownService } = await import('turndown')

  const turndownService = new TurndownService({ headingStyle: 'atx', hr: '---', ...options })

  if (options.keep)
    turndownService.keep(options.keep)

  return turndownService.turndown(html)
}

export async function proseToMarkdown(prose: string) {
  return toMarkdown(prose, { keep: [
    'figure',
    'figcaption',
    'sup',
    'sub',
    'ins',
    'del',
    'mark',
    'abbr',
    'dfn',
    'var',
    'samp',
    'kbd',
    'q',
    'cite',
    'time',
    'address',
    'dl',
    'dt',
    'dd',
    'details',
    'summary',
    'audio',
    'button',
  ] })
}
/**
 * Convert markdown into HTML
 */
export async function renderMarkdown(content = '', options?: MarkdownOptions): Promise<string> {
  const util = await getMarkdownUtility()

  if (typeof content !== 'string')
    return ''

  // Parse the markdown content and trim whitespace
  return (await util.parse(content, options)).trim()
}

/**
 * Parse markdown file into frontmatter and body
 */
export async function parseMarkdownFile(content: string): Promise<{
  attributes: Record<string, unknown>
  bodyMarkdown: string
  bodyHtml: string
}> {
  const fm = Frontmatter<unknown>(content)
  const bodyHtml = await renderMarkdown(fm.body)
  return {
    attributes: fm.attributes as Record<string, unknown>,
    bodyMarkdown: fm.body,
    bodyHtml,
  }
}

export async function fileToPost(file: () => Promise<MarkdownFile>): Promise<PostOrPage> {
  const { attributes, bodyMarkdown, bodyHtml, VueComponent, VueComponentWith }
    = await file()
  const postId = fastHash(
    attributes.permalink || attributes.title || bodyMarkdown,
  )
  const post = {
    postId,
    ...attributes,
    route: `/p/${attributes.permalink || postId}`,
    bodyMarkdown,
    bodyHtml,
    VueComponent,
    VueComponentWith,
  }
  return post
}

/**
 * Removes the markdown formatting from text
 */
export function stripMarkdown(markdown: string): string {
  return removeMarkdownUtility(markdown)
}
/**
 * Removes markdown and shortens to a determined work length
 */
export function excerpt(content: string, { length = 42 } = {}): string {
  if (!content)
    return ''

  // Strip markdown and replace newlines and carriage returns with spaces
  const strippedContent = stripMarkdown(content).replace(/\r?\n/g, ' ')

  // Split by spaces, filter out empty strings to avoid extra spaces
  const words = strippedContent.split(' ').filter(word => word !== '')

  // Determine if an ellipsis is needed
  const needsEllipsis = words.length > length

  // Join the required number of words
  const excerptText = words.slice(0, length).join(' ')

  // Add ellipsis if the content was longer than the specified length
  return needsEllipsis ? `${excerptText}...` : excerptText
}
