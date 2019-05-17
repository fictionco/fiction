export default Factor => {
  return new (class {
    constructor() {}
    config() {
      const normalized = this.norm([
        {
          name: "Installation",
          permalink: "installation",
          title: "Installing Factor Framework and CMS",
          description: "Quick start guide on how to install Factor framwork and Vue CMS in less than 5 minutes.",
          file: require("./installation/index.md")
        },
        {
          name: "Introduction",
          permalink: "",
          file: require("./introduction/index.md"),
          title: "Introduction: Why Use Factor"
        },
        {
          name: "Routing and Views",
          permalink: "routing",
          file: require("./installation/index.md"),
          title: "Creating Custom Routes and View Components"
        },
        {
          name: "Configuration and Setup",
          permalink: "configuration",
          file: require("./installation/index.md")
        }
      ])

      return normalized
    }

    getMarkdownHTML(permalink) {
      const { file } = this.selected(permalink)
      return file
    }

    selected(permalink) {
      return this.config().find(_ => _.permalink == permalink)
    }

    norm(items) {
      return items.map(_ => {
        const p = _.permalink

        const d = {
          permalink: p,
          name: Factor.$utils.toLabel(p),
          title: Factor.$utils.toLabel(p),
          description: ""
        }

        return { ...d, ..._ }
      })
    }
  })()
}
