import Factor from "vue"
import FactorMeta from "vue-meta"

Factor.use(FactorMeta, {
  keyName: "metaInfoCore"
})

export default Factor => {
  return new (class {
    constructor() {
      this.installMeta()

      this.setDefault()

      this.refineMetaHandling()

      this.addSSRHooks()
    }

    addSSRHooks() {
      Factor.$filters.add("ssr-context-ready", (context, { app, router }) => {
        // Add Vue-Meta
        context.metaInfo = app.$meta()

        // the html template extension mechanism
        // This uses a callback because the component's 'created' hooks are called after this point

        const metaHooks = ["factor_head", "factor_body_start", "factor_body_end"]

        metaHooks.forEach(h => {
          context[h] = () => {
            return Factor.$filters.apply(h, [], { context }).join("")
          }
        })

        // Distinguish between content and dashboard UI
        const { meta: { ui = "app" } = {} } =
          router.currentRoute.matched.find(_ => _.meta.ui) || {}

        const attrHooks = [
          { name: "factor_html_attr", attr: [], classes: [`factor-${ui}`] },
          { name: "factor_body_attr", attr: [], classes: [] },
          { name: "factor_head_attr", attr: [], classes: [] }
        ]

        attrHooks.forEach(({ name, attr, classes }) => {
          context[name] = additional => {
            classes.push(additional)
            attr.push(`class="${classes.join(" ")}"`)
            return Factor.$filters.apply(name, attr, { context }).join(" ")
          }
        })

        return context
      })
    }

    setDefault() {
      Factor.$filters.add("site-mixins", _ => [
        ..._,
        {
          metaInfo() {
            return Factor.$filters.apply("meta-default", {
              htmlAttrs: {
                lang: "en"
              },
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
    }

    refineMetaHandling() {
      Factor.$filters.callback("initialize-app", () => {
        Factor.mixin({
          metaInfoCore() {
            const opt = this.$options.metaInfo

            if (!opt) return {}

            const meta = typeof opt == "function" ? opt.call(this) : opt

            const refined = Factor.$filters.apply("meta-refine", meta)

            return refined
          }
        })
      })

      Factor.$filters.add("meta-refine", data => {
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
      })
    }

    installMeta() {
      Factor.$filters.add("factor_head", (_, { context }) => {
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

      Factor.$filters.add("factor_html_attr", (_, { context }) => {
        const { htmlAttrs } = context.metaInfo.inject()
        return [..._, htmlAttrs.text(true)]
      })
      Factor.$filters.add("factor_body_attr", (_, { context }) => {
        const { bodyAttrs } = context.metaInfo.inject()
        return [..._, bodyAttrs.text()]
      })
      Factor.$filters.add("factor_head_attr", (_, { context }) => {
        const { headAttrs } = context.metaInfo.inject()
        return [..._, headAttrs.text()]
      })

      Factor.$filters.add("factor_body_start", (_, { context }) => {
        const { style, script, noscript } = context.metaInfo.inject()

        return [
          ..._,
          style.text({ pbody: true }),
          script.text({ pbody: true }),
          noscript.text({ pbody: true })
        ]
      })

      Factor.$filters.add("factor_body_end", (_, { context }) => {
        const { style, script, noscript } = context.metaInfo.inject()

        return [
          ..._,
          style.text({ body: true }),
          script.text({ body: true }),
          noscript.text({ body: true })
        ]
      })
    }
  })()
}
