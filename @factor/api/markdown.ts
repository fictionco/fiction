import { slugify, dotSetting } from "@factor/api/utils"
import { getStoreState } from "@factor/app/store"
import MarkdownIt from "markdown-it"
import mdAnchor from "markdown-it-anchor"
import mdVideo from "markdown-it-video"
import mdLinkAttributes from "markdown-it-link-attributes"
import mdImplicitFigures from "markdown-it-implicit-figures"
import { setting } from "@factor/api/settings"
import frontMatter from "front-matter"
import Vue from "vue"
import { getRouter, getStore } from "@factor/api"
let markdownUtility: MarkdownIt

interface MarkdownRenderOptions {
  variables?: boolean
  permalink?: true
}

const getMarkdownUtility = (options: MarkdownRenderOptions = {}): MarkdownIt => {
  if (!markdownUtility) {
    markdownUtility = MarkdownIt({
      html: true,
      linkify: true,
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
export const renderMarkdown = (content = "", options?: MarkdownRenderOptions): string => {
  const util = getMarkdownUtility(options)

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

      return val || matched
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

export const injectMarkdownComponents = (): void => {
  if (!document) return

  const injected = document.querySelectorAll(".inject-component:not(.injected)")

  injected.forEach(async (el) => {
    const asyncComponent = setting(el.id)
    if (asyncComponent) {
      const { default: component } = await asyncComponent()
      const ComponentClass = Vue.extend(component)
      const instance = new ComponentClass({
        router: getRouter(),
        store: getStore(),
      })

      instance.$mount() // pass nothing
      el.append(instance.$el)
      el.classList.add("injected")
    }
  })
}
