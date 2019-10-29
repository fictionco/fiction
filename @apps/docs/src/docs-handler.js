import { toLabel, setting } from "@factor/tools"
export default Factor => {
  return new (class {
    config() {
      return this.normalize(setting("docs.pages"))
    }
    getMarkdownHTML(doc) {
      const { file } = this.selected(doc) || {}
      return file ? Factor.$markdown.render(file) : null
    }

    selected(doc) {
      return this.config().find(_ => _.doc == doc)
    }

    metatags(doc) {
      const { title, description } = this.selected(doc) || {}

      return { title, description }
    }

    normalize(items) {
      return items.map(_ => {
        const d = {
          doc: _.doc,
          route: `/${setting("docs.base")}/${_.doc}`,
          name: toLabel(_.doc),
          title: toLabel(_.doc),
          description: ""
        }

        return { ...d, ..._ }
      })
    }
  })()
}
