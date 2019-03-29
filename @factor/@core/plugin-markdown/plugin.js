export default Factor => {
  return new class {
    constructor() {
      this.util = null
    }

    getUtil() {
      if (!this.util) {
        this.util = require("markdown-it")({
          html: false,
          linkify: true,
          typographer: false
        })
        this.util.use(require("markdown-it-anchor"), {
          slugify: Factor.$utils.slugify
        })
        this.util.use(require("markdown-it-video"))
        //this.util.use(require("markdown-it-highlightjs"))
        this.util.use(require("markdown-it-link-attributes"), {
          attrs: {
            target: "_blank",
            rel: "noopener"
          }
        })
        this.util.use(require("markdown-it-implicit-figures"), {
          dataType: true, // <figure data-type="image">, default: false
          figcaption: true, // <figcaption>alternative text</figcaption>, default: false
          tabindex: false, // <figure tabindex="1+n">..., default: false
          link: true // <a href="img.png"><img src="img.png"></a>, default: false
        })
      }

      return this.util
    }

    render(content = "", options = {}) {
      const util = this.getUtil()
      if (typeof content == "string") {
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
  }()
}
