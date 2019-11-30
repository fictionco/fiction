import Vue from "vue"
import VueMeta from "vue-meta"
import { addFilter, applyFilters, addCallback } from "@factor/tools"
import "./route-class"

Vue.use(VueMeta, { keyName: "metaInfoCore" })

addFilter("ssr-context-ready", (context, { vm, router }) => {
  // Add Vue-Meta
  context.metaInfo = vm.$meta()

  // the html template extension mechanism
  // This uses a callback because the component's 'created' hooks are called after this point

  const metaHooks = ["factor_head", "factor_body_start", "factor_body_end"]

  metaHooks.forEach((h) => {
    context[h] = (): string => applyFilters(h, [], { context }).join("")
  })

  // Distinguish between content and dashboard UI
  const { meta: { ui = "app" } = {} } =
    router.currentRoute.matched.find((_) => _.meta.ui) || {}

  const attrHooks = [
    { name: "factor_html_attr", attr: [], classes: [`factor-${ui}`] },
    { name: "factor_body_attr", attr: [], classes: [] },
    { name: "factor_head_attr", attr: [], classes: [] }
  ]

  attrHooks.forEach(({ name, attr, classes }) => {
    context[name] = (additional): string => {
      classes.push(additional)
      attr.push(`class="${classes.join(" ")}"`)
      return applyFilters(name, attr, { context }).join(" ")
    }
  })

  return context
})

addFilter("site-mixins", (_) => [
  ..._,
  {
    metaInfo() {
      return applyFilters("meta-default", {
        htmlAttrs: { lang: "en" },
        meta: [
          { charset: "utf-8" },
          {
            name: "viewport",
            content:
              "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"
          }
        ]
      })
    }
  }
])

addCallback("initialize-app", (): void => {
  Vue.mixin(
    Vue.extend({
      metaInfoCore() {
        const opt = this.$options.metaInfo

        if (!opt) return {}

        const meta = typeof opt == "function" ? opt.call(this) : opt

        const refined = applyFilters("meta-refine", meta)

        return refined
      }
    })
  )
})

addFilter(
  "meta-refine",
  (data) => {
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
        name: "og:image",
        content: data.image
      })
    }
    return data
  },
  { priority: 200 }
)

addFilter("factor_head", (_, { context }) => {
  const { title, link, style, script, noscript, meta } = context.metaInfo.inject()

  return [
    ..._,
    meta.text(),
    title.text(),
    link.text(),
    style.text(),
    script.text(),
    noscript.text()
  ]
})

addFilter("factor_html_attr", (_, { context }) => {
  const { htmlAttrs } = context.metaInfo.inject()
  return [..._, htmlAttrs.text(true)]
})
addFilter("factor_body_attr", (_, { context }) => {
  const { bodyAttrs } = context.metaInfo.inject()
  return [..._, bodyAttrs.text()]
})
addFilter("factor_head_attr", (_, { context }) => {
  const { headAttrs } = context.metaInfo.inject()
  return [..._, headAttrs.text()]
})

addFilter("factor_body_start", (_, { context }) => {
  const { style, script, noscript } = context.metaInfo.inject()

  return [
    ..._,
    style.text({ pbody: true }),
    script.text({ pbody: true }),
    noscript.text({ pbody: true })
  ]
})

addFilter("factor_body_end", (_, { context }) => {
  const { style, script, noscript } = context.metaInfo.inject()

  return [
    ..._,
    style.text({ body: true }),
    script.text({ body: true }),
    noscript.text({ body: true })
  ]
})
