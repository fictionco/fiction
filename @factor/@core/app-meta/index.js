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
      Factor.$filters.add("ssr-context-ready", (ssrContext, { app, router }) => {
        // Add Vue-Meta
        ssrContext.metaInfo = app.$meta()

        // the html template extension mechanism
        // This uses a callback because the component's 'created' hooks are called after this point

        const metaHooks = ["factor_head", "factor_body_start", "factor_body_end"]

        metaHooks.forEach(h => {
          ssrContext[h] = () => {
            return Factor.$filters.apply(h, [], { ssrContext }).join("")
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
          ssrContext[name] = additional => {
            classes.push(additional)
            attr.push(`class="${classes.join(" ")}"`)
            return Factor.$filters.apply(name, attr, { ssrContext }).join(" ")
          }
        })

        return ssrContext
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

            return Factor.$filters.apply("meta-refine", meta)
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
      Factor.$filters.add("factor_head", (_, { ssrContext }) => {
        const {
          title,
          link,
          style,
          script,
          noscript,
          meta
        } = ssrContext.metaInfo.inject()

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

      Factor.$filters.add("factor_html_attr", (_, { ssrContext }) => {
        const { htmlAttrs } = ssrContext.metaInfo.inject()
        return [..._, htmlAttrs.text(true)]
      })
      Factor.$filters.add("factor_body_attr", (_, { ssrContext }) => {
        const { bodyAttrs } = ssrContext.metaInfo.inject()
        return [..._, bodyAttrs.text()]
      })
      Factor.$filters.add("factor_head_attr", (_, { ssrContext }) => {
        const { headAttrs } = ssrContext.metaInfo.inject()
        return [..._, headAttrs.text()]
      })

      Factor.$filters.add("factor_body_start", (_, { ssrContext }) => {
        const { style, script, noscript } = ssrContext.metaInfo.inject()

        return [
          ..._,
          style.text({ pbody: true }),
          script.text({ pbody: true }),
          noscript.text({ pbody: true })
        ]
      })

      Factor.$filters.add("factor_body_end", (_, { ssrContext }) => {
        const { style, script, noscript } = ssrContext.metaInfo.inject()

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
