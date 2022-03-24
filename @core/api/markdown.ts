import frontMatter from "front-matter"
import MarkdownIt from "markdown-it"
import mdAnchor from "markdown-it-anchor"
import mdImplicitFigures from "markdown-it-implicit-figures"
import mdLinkAttributes from "markdown-it-link-attributes"
import mdVideo from "markdown-it-video"

import { slugify } from "./utils"

let markdownUtility: MarkdownIt

interface MarkdownRenderOptions {
  variables?: boolean
  permalink?: true
  html?: boolean
}

export const getMarkdownUtility = (
  options: MarkdownRenderOptions = {},
): MarkdownIt => {
  if (!markdownUtility) {
    markdownUtility = MarkdownIt({
      html: options.html || false,
      linkify: false,
      typographer: false,
      breaks: true,
    })

    markdownUtility.use(mdAnchor, {
      slugify,
      permalink: options.permalink ?? false,
      permalinkSymbol: "#",
    })
    markdownUtility.use(mdVideo)
    markdownUtility.use(mdLinkAttributes)
    markdownUtility.use(mdImplicitFigures, {
      dataType: true, // <figure data-type="image">, default: false
      figcaption: true, // <figcaption>alternative text</figcaption>, default: false
      tabindex: false, // <figure tabindex="1+n">..., default: false
      link: true, // <a href="img.png"><img src="img.png"></a>, default: false
    })
  }

  return markdownUtility
}

/**
 * Convert markdown into HTML
 * @param content - the markdown content
 * @param options.variables - does the markdown support variables?
 */
export const renderMarkdown = (
  content = "",
  options?: MarkdownRenderOptions,
): string => {
  const util = getMarkdownUtility(options)

  if (typeof content !== "string") {
    return ""
  }

  return util.render(content, options)
}

/**
 * Parse meta YAML and render markdown
 * @param markdown - raw markdown with YAML header
 * @param options - parsing options for render
 */
export const renderMarkdownWithMeta = (
  markdown = "",
  options?: MarkdownRenderOptions,
): { meta: Record<string, string>; content: string } => {
  const { attributes, body } = frontMatter(markdown)

  return {
    meta: attributes as Record<string, string>,
    content: renderMarkdown(body, options),
  }
}
