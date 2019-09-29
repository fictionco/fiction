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
      Factor.$filters.add("ssr-context", (ssrContext, { app }) => {
        ssrContext.metaInfo = app.$meta()
        return ssrContext
      })

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
