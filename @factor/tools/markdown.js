import { slugify, dotSetting, getStoreState } from "@factor/tools"
import md from "markdown-it"
import mdAnchor from "markdown-it-anchor"
import mdVideo from "markdown-it-video"
import mdLinkAttributes from "markdown-it-link-attributes"
import mdImplicitFigures from "markdown-it-implicit-figures"
import remark from "remark"
import stripMarkdown from "strip-markdown"

export class FactorMarkdown {
  constructor() {
    this.lib = null
  }

  util() {
    if (!this.lib) {
      this.lib = md({
        html: true,
        linkify: true,
        typographer: false
      })

      this.lib.use(mdAnchor, { slugify })
      this.lib.use(mdVideo)

      this.lib.use(mdLinkAttributes)
      this.lib.use(mdImplicitFigures, {
        dataType: true, // <figure data-type="image">, default: false
        figcaption: true, // <figcaption>alternative text</figcaption>, default: false
        tabindex: false, // <figure tabindex="1+n">..., default: false
        link: true // <a href="img.png"><img src="img.png"></a>, default: false
      })
    }

    return this.lib
  }

  render(content = "", options = {}) {
    const util = this.util()
    if (typeof content == "string") {
      const { variables } = options
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

  strip(markdown) {
    let out = ""
    remark()
      .use(stripMarkdown)
      .process(markdown, (error, file) => {
        if (error) throw error
        out = String(file)
      })

    return out
  }
}

export const $markdown = new FactorMarkdown()

export function renderMarkdown(content, options = {}) {
  return $markdown.render(content, options)
}
