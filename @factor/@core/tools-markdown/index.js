export default Factor => {
  return new (class {
    constructor() {
      this.lib = null
    }

    util() {
      if (!this.lib) {
        this.lib = require("markdown-it")({
          html: true,
          linkify: true,
          typographer: false
        })

        this.lib.use(require("markdown-it-anchor").default, {
          slugify: Factor.$utils.slugify
        })
        this.lib.use(require("markdown-it-video"))

        this.lib.use(require("markdown-it-link-attributes"), {
          attrs: {
            target: "_blank",
            rel: "noopener"
          }
        })
        this.lib.use(require("markdown-it-implicit-figures"), {
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
          content = content.replace(/{{([\s\S]+?)}}/g, (matched, index, original) => {
            const setting = matched.replace(/[{}]/g, "")
            const val = Factor.$utils.dotSetting({
              key: setting,
              settings: Factor.$store.state
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
      require("remark")()
        .use(require("strip-markdown"))
        .process(markdown, (error, file) => {
          if (error) {
            throw error
          }
          out = String(file)
        })

      return out
    }
  })()
}
