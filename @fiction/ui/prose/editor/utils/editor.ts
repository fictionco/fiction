import type { EndpointResponse } from '@fiction/core'

export type EditorSupplementary = Partial<{
  title: string
  subTitle: string
  outline: string
  description: string
  tags: string[]
  category: string
  author: string
  publishDate: string
  estimatedReadTime: number
  featuredImage: string
  keywords: string[]
}>

export function generateAutocompleteObjectives(supplementary: EditorSupplementary): Record<string, string> {
  const objectives: Record<string, string> = {}

  if (supplementary.title) {
    objectives.title = `Reference title of content: ${supplementary.title}`
  }

  if (supplementary.subTitle) {
    objectives.subTitle = `Consider the subtitle: ${supplementary.subTitle}`
  }

  if (supplementary.outline) {
    objectives.outline = `Follow the general outline: ${supplementary.outline}`
  }

  if (supplementary.description) {
    objectives.description = `Keep in mind the overall description: ${supplementary.description}`
  }

  if (supplementary.tags && supplementary.tags.length > 0) {
    objectives.tags = `Incorporate relevant concepts from these tags: ${supplementary.tags.join(', ')}`
  }

  if (supplementary.category) {
    objectives.category = `Align content with the category: ${supplementary.category}`
  }

  if (supplementary.keywords && supplementary.keywords.length > 0) {
    objectives.keywords = `Incorporate these key SEO terms naturally: ${supplementary.keywords.join(', ')}`
  }

  // Add a general instruction if any supplementary information is provided
  if (Object.keys(objectives).length > 0) {
    objectives.general = 'Use the provided supplementary information to guide your suggestions. Ensure they are contextually relevant, coherent with the overall content structure, and appropriate for a blog post format.'
  }

  return objectives
}

export function shouldSuggest(args: { previousText: string, nextText: string }): EndpointResponse {
  const { previousText, nextText } = args

  if (previousText.trim().length < 5) {
    return { status: 'error', message: 'Not suggesting: insufficient context.' }
  }

  if (/\w$/.test(previousText) && /^\w/.test(nextText)) {
    return { status: 'error', message: 'Not suggesting: cursor is in the middle of a word.' }
  }

  const atWordBoundary = /\w+[.,;!?]?$/.test(previousText)
  const hasSpacesBetween = /\s$/.test(previousText) || /^\s/.test(nextText)
  const atNewLine = previousText.endsWith('\n')

  if (atWordBoundary || hasSpacesBetween || atNewLine) {
    const reason = atNewLine
      ? 'cursor is at a new line'
      : atWordBoundary
        ? 'cursor is at the end of a word'
        : 'cursor is between words'
    return { status: 'success', message: `Suggesting: ${reason}.` }
  }

  return { status: 'error', message: 'Not suggesting: conditions not met for suggestion.' }
}
