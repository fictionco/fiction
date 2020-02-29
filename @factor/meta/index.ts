import Vue from "vue"
import VueMeta, { MetaInfo } from "vue-meta"
import {
  addFilter,
  applyFilters,
  addCallback,
  titleTag,
  descriptionTag,
  shareImage
} from "@factor/api"
import { setting } from "@factor/api/settings"
import { FactorPostState } from "@factor/post/types"
import { canonicalUrl } from "@factor/api/url"
import { ServerRenderContext, ApplicationComponents } from "@factor/app/types"
import { FactorMetaInfo } from "./types"
import "./route-class"
import { version } from "@factor/core/package.json"

Vue.use(VueMeta, { keyName: "metaInfoCore" })

interface MetaHookOptions {
  context: ServerRenderContext;
}
const key = "metaInfo"

addFilter({
  key,
  hook: "ssr-context-ready",
  callback: (context: ServerRenderContext, { vm, router }: ApplicationComponents) => {
    /**
     * Add Vue-Meta information to context
     */
    context.metaInfo = vm.$meta()

    /**
     * the html template extension mechanism
     * This uses a callback because the component's 'created' hooks are called after this point
     */
    const metaHooks = ["factor_head", "factor_body_start", "factor_body_end"]

    metaHooks.forEach(h => {
      context[h] = (): string => applyFilters(h, [], { context }).join("")
    })

    // Distinguish between content and dashboard UI
    const { meta: { ui = "app" } = {} } =
      router.currentRoute.matched.find(_ => _.meta.ui) || {}

    const attrHooks = [
      { name: "factor_html_attr", attr: [], classes: [`factor-${ui}`] },
      { name: "factor_body_attr", attr: [], classes: [] },
      { name: "factor_head_attr", attr: [], classes: [] }
    ]

    attrHooks.forEach(
      ({ name, attr, classes }: { name: string; attr: string[]; classes: string[] }) => {
        context[name] = (additional?: string): string => {
          if (additional) classes.push(additional)
          attr.push(`class="${classes.join(" ")}"`)
          return applyFilters(name, attr, { context }).join(" ")
        }
      }
    )

    return context
  }
})

addFilter({
  key,
  hook: "site-mixins",
  callback: (_: object[]) => [
    ..._,
    {
      metaInfo(): MetaInfo {
        const post: FactorPostState = this.post

        const postInfo = post
          ? {
              title: titleTag(post._id),
              description: descriptionTag(post._id),
              image: shareImage(post._id)
            }
          : {}

        /**
         * Default meta information
         */
        const defaultMeta = {
          htmlAttrs: { lang: "en" },
          meta: [
            { charset: "utf-8" },
            {
              name: "viewport",
              content:
                "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"
            },
            { name: "generator", content: `Factor ${version}` }
          ]
        }

        const metaSettings = setting("metaInfo") ?? {}

        const meta = applyFilters("meta-default", {
          ...defaultMeta,
          ...metaSettings,
          ...postInfo
        })

        return meta
      }
    }
  ]
})

addCallback({
  key,
  hook: "initialize-app",
  callback: (): void => {
    Vue.mixin(
      Vue.extend({
        metaInfoCore() {
          const opt = this.$options.metaInfo

          if (!opt) return {}

          const meta = typeof opt == "function" ? opt.call(this) : opt

          const refined = applyFilters("meta-component", meta)

          return refined
        }
      })
    )
  }
})

/**
 * Improve the syntax for metaInfo by allowing direct keys
 * for commonly used meta (image, description)
 */
addFilter({
  key,
  hook: "meta-component",
  callback: (data: FactorMetaInfo) => {
    if (!data.meta) data.meta = []

    if (data.description) {
      data.meta.push({
        vmid: "description",
        name: "description",
        content: data.description
      })
    }

    if (data.image && !data.image.includes("base64")) {
      data.meta.push({
        vmid: "og:image",
        property: "og:image",
        content: canonicalUrl(data.image)
      })
    }

    if (data.title) {
      data.meta.push({
        vmid: "og:title",
        property: "og:title",
        content: data.title
      })
    }
    return data
  },
  priority: 200
})

/**
 * Inside the <head>
 */
addFilter({
  key,
  hook: "factor_head",
  callback: (__: string[], { context }: MetaHookOptions) => {
    const { title, link, style, script, noscript, meta } = context.metaInfo.inject()

    return [
      ...__,
      meta.text(),
      title.text(),
      link.text(),
      style.text(),
      script.text(),
      noscript.text()
    ]
  }
})

/**
 * Added to <html>
 */
addFilter({
  key,
  hook: "factor_html_attr",
  callback: (_: string[], { context }: MetaHookOptions) => {
    const { htmlAttrs } = context.metaInfo.inject()
    return [..._, htmlAttrs.text(true)]
  }
})

/**
 * Added to <body>
 */
addFilter({
  key,
  hook: "factor_body_attr",
  callback: (_: string[], { context }: MetaHookOptions) => {
    const { bodyAttrs } = context.metaInfo.inject()
    return [..._, bodyAttrs.text()]
  }
})

/**
 * Added to <head>
 */
addFilter({
  key,
  hook: "factor_head_attr",
  callback: (_: string[], { context }: MetaHookOptions) => {
    const { headAttrs } = context.metaInfo.inject()
    return [..._, headAttrs.text()]
  }
})

/**
 * Meta information at the top of the body
 */
addFilter({
  key,
  hook: "factor_body_start",
  callback: (_: string[], { context }: MetaHookOptions) => {
    const { style, script, noscript } = context.metaInfo.inject()

    return [
      ..._,
      style.text({ pbody: true }),
      script.text({ pbody: true }),
      noscript.text({ pbody: true })
    ]
  }
})

/**
 * Meta information at the end of the body
 */
addFilter({
  key,
  hook: "factor_body_end",
  callback: (_: string[], { context }: MetaHookOptions) => {
    const { style, script, noscript } = context.metaInfo.inject()

    return [
      ..._,
      style.text({ body: true }),
      script.text({ body: true }),
      noscript.text({ body: true })
    ]
  }
})
