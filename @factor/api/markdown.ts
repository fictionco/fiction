import { slugify, dotSetting } from "@factor/api/utils"
import { getStoreState } from "@factor/app/store"
import MarkdownIt from "markdown-it"
import mdAnchor from "markdown-it-anchor"
import mdVideo from "markdown-it-video"
import mdLinkAttributes from "markdown-it-link-attributes"
import mdImplicitFigures from "markdown-it-implicit-figures"
import { setting } from "@factor/api"
import frontMatter from "front-matter"
let markdownUtility: MarkdownIt

const getMarkdownUtility = (): MarkdownIt => {
  if (!markdownUtility) {
    markdownUtility = MarkdownIt({
      html: true,
      linkify: true,
      typographer: false,
      breaks: true,
    })

    markdownUtility.use(mdAnchor, { slugify })
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

interface MarkdownRenderOptions {
  variables?: boolean
}

/**
 * Convert markdown into HTML
 * @param content - the markdown content
 * @param options.variables - does the markdown support variables?
 */
export const renderMarkdown = (content = "", options?: MarkdownRenderOptions): string => {
  const util = getMarkdownUtility()

  if (typeof content !== "string") {
    return ""
  }

  const { variables } = options || {}
  if (variables) {
    content = content.replace(/{{([\S\s]+?)}}/g, (matched) => {
      const settingKey = matched.replace(/[{}]/g, "")
      let val = dotSetting({
        key: settingKey,
        settings: getStoreState(),
      })

      if (!val) {
        val = setting(settingKey)
      }

      return val || ""
    })
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
  options?: MarkdownRenderOptions
): { meta: Record<string, string>; content: string } => {
  const { attributes, body } = frontMatter(markdown)

  return {
    meta: attributes as Record<string, string>,
    content: renderMarkdown(body, options),
  }
}
