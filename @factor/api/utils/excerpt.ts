import removeMarkdownUtility from "remove-markdown"
/**
 * Removes the markdown formatting from text
 */
export const stripMarkdown = (markdown: string): string => {
  return removeMarkdownUtility(markdown)
}
/**
 * Removes markdown and shortens to a determined work length
 */
export const excerpt = (content: string, { length = 42 } = {}): string => {
  if (!content) return ""

  const __ = stripMarkdown(content).replace(/\n|\r/g, " ").split(" ")

  return __.length > length
    ? __.slice(0, length).join(" ") + "..."
    : __.join(" ")
}
