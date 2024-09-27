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

export function shouldSuggest(previousText: string, nextText: string): boolean {
  // Check for line breaks
  const previousEndsWithLineBreak = /\n\s*$/.test(previousText)
  const nextStartsWithLineBreak = /^\s*\n/.test(nextText)
  const hasLineBreak = previousEndsWithLineBreak || nextStartsWithLineBreak

  // Trim whitespace from the end of previousText and start of nextText
  const trimmedPrevious = previousText.trimEnd()
  const trimmedNext = nextText.trimStart()

  // Check for list items (allow shorter content for list items)
  const isListItem = /<li>\s*$/.test(trimmedPrevious)

  // For non-list items, require a minimum length
  if (!isListItem && trimmedPrevious.length < 10 && !hasLineBreak)
    return false

  // Additional cases where we should not suggest
  if (trimmedPrevious.endsWith('/'))
    return false
  if (/<code[^>]*>\s*$/.test(trimmedPrevious))
    return false // Inside code block or inline code
  if (/<a[^>]*>\s*$/.test(trimmedPrevious))
    return false // Inside URL/link
  if (/<[^>]*$/.test(trimmedPrevious))
    return false // Inside any open HTML tag

  // Check if the cursor is at the end of a sentence or a natural pause
  const endsWithSentenceBreak = /[.!?]\s*$/.test(trimmedPrevious)
  const endsWithColon = trimmedPrevious.endsWith(':')
  const endsWithComma = trimmedPrevious.endsWith(',')

  // Check if the next word has started
  const nextWordStarted = /^\S/.test(trimmedNext)

  // Determine if we're in the middle of a sentence
  const inMiddleOfSentence = !endsWithSentenceBreak && trimmedPrevious.length > 0 && !nextWordStarted

  // Suggest if:
  // 1. We're at the end of a sentence
  // 2. We're at a colon (expecting a list or explanation)
  // 3. We're starting a new list item
  // 4. We're in the middle of a sentence but at a natural pause (like after a comma)
  // 5. We're in the middle of a sentence and the next word hasn't started
  // 6. There's a line break
  // 7. We're at the end of a block-level element
  const atEndOfBlockElement = /<\/(p|h[1-6]|div|li)>\s*$/.test(trimmedPrevious)

  return (
    endsWithSentenceBreak
    || endsWithColon
    || isListItem
    || (endsWithComma && !nextWordStarted)
    || inMiddleOfSentence
    || hasLineBreak
    || atEndOfBlockElement
  )
}
