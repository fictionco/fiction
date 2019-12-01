import { slugify, dotSetting } from "@factor/tools/utils"
import { getStoreState } from "@factor/app/store"
import MarkdownIt from "markdown-it"
import mdAnchor from "markdown-it-anchor"
import mdVideo from "markdown-it-video"
import mdLinkAttributes from "markdown-it-link-attributes"
import mdImplicitFigures from "markdown-it-implicit-figures"
import remark from "remark"
import stripMarkdownUtility from "strip-markdown"

let markdownUtility: MarkdownIt

function getMarkdownUtility(): MarkdownIt {
  if (!markdownUtility) {
    markdownUtility = MarkdownIt({
      html: true,

      linkify: true,
      typographer: false
    })

    markdownUtility.use(mdAnchor, { slugify })
    markdownUtility.use(mdVideo)

    markdownUtility.use(mdLinkAttributes)
    markdownUtility.use(mdImplicitFigures, {
      dataType: true, // <figure data-type="image">, default: false
      figcaption: true, // <figcaption>alternative text</figcaption>, default: false
      tabindex: false, // <figure tabindex="1+n">..., default: false
      link: true // <a href="img.png"><img src="img.png"></a>, default: false
    })
  }

  return markdownUtility
}

interface MarkdownRenderOptions {
  variables?: boolean;
}

export function renderMarkdown(content = "", options?: MarkdownRenderOptions): string {
  const util = getMarkdownUtility()
  if (typeof content == "string") {
    const { variables } = options || {}
    if (variables) {
      content = content.replace(/{{([\s\S]+?)}}/g, matched => {
        const setting = matched.replace(/[{}]/g, "")
        const val = dotSetting({
          key: setting,
          settings: getStoreState()
        })

        return val || ""
      })
    }

    return util.render(content, options)
  } else {
    return ""
  }
}

export function stripMarkdown(markdown: string): string {
  let out = ""
  remark()
    .use(stripMarkdownUtility)
    .process(markdown, (error, file) => {
      if (error) throw error
      out = String(file)
    })

  return out
}

export function excerpt(content: string, { length = 42 } = {}): string {
  if (!content) return ""

  const __ = stripMarkdown(content)
    .replace(/\n|\r/g, " ")
    .split(" ")

  return __.length > length ? __.slice(0, length).join(" ") + "..." : __.join(" ")
}
