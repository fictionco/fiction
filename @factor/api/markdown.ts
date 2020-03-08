import { slugify, dotSetting } from "@factor/api/utils"
import { getStoreState } from "@factor/app/store"
import MarkdownIt from "markdown-it"
import mdAnchor from "markdown-it-anchor"
import mdVideo from "markdown-it-video"
import mdLinkAttributes from "markdown-it-link-attributes"
import mdImplicitFigures from "markdown-it-implicit-figures"
import { setting } from "@factor/api"
let markdownUtility: MarkdownIt

const getMarkdownUtility = (): MarkdownIt => {
  if (!markdownUtility) {
    markdownUtility = MarkdownIt({
      html: true,
      linkify: true,
      typographer: false,
      breaks: true
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

export const renderMarkdown = (content = "", options?: MarkdownRenderOptions): string => {
  const util = getMarkdownUtility()
  if (typeof content == "string") {
    const { variables } = options || {}
    if (variables) {
      content = content.replace(/{{([\S\s]+?)}}/g, matched => {
        const settingKey = matched.replace(/[{}]/g, "")
        let val = dotSetting({
          key: settingKey,
          settings: getStoreState()
        })

        if (!val) {
          val = setting(settingKey)
        }

        return val || ""
      })
    }

    return util.render(content, options)
  } else {
    return ""
  }
}
