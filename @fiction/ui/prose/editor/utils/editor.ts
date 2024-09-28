import type { EndpointResponse } from '@fiction/core'
import type { Editor } from '@tiptap/core'

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

  const conditions = [
    {
      check: () => /[.!?,;]\s*$/.test(previousText.trim()),
      successMessage: 'Suggesting after sentence-ending punctuation or clause break.',
      failureMessage: 'No sentence-ending punctuation or clause break detected.',
    },
    {
      check: () => nextText.trim() === '' || nextText.startsWith('\n'),
      successMessage: 'Suggesting at the end of a line or paragraph.',
      failureMessage: 'Not at the end of a line or paragraph.',
    },
    {
      check: () => previousText.trim().length >= 5,
      successMessage: 'Sufficient context for suggestion.',
      failureMessage: 'Insufficient context for meaningful suggestion.',
    },
  ]

  for (const condition of conditions) {
    if (!condition.check()) {
      return {
        status: 'error',
        message: condition.failureMessage,
      }
    }
  }

  return {
    status: 'success',
    message: conditions.map(c => c.successMessage).join(' '),
  }
}
