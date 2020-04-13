import remark from "remark"
import stripMarkdownUtility from "strip-markdown"

export const stripMarkdown = (markdown: string): string => {
  let out = ""
  remark()
    .use(stripMarkdownUtility)
    .process(markdown, (error, file) => {
      if (error) throw error
      out = String(file)
    })

  return out
}

export const excerpt = (content: string, { length = 42 } = {}): string => {
  if (!content) return ""

  const __ = stripMarkdown(content).replace(/\n|\r/g, " ").split(" ")

  return __.length > length ? __.slice(0, length).join(" ") + "..." : __.join(" ")
}
