import settings from "#/settings"
export default Factor => {
  return new (class {
    config() {
      return this.normalize(settings.docs)
    }
    getMarkdownHTML(doc) {
      const { file } = this.selected(doc) || {}
      return file ? file : null
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
          route: `/${settings.basePath}/${_.doc}`,
          name: Factor.$utils.toLabel(_.doc),
          title: Factor.$utils.toLabel(_.doc),
          description: ""
        }

        return { ...d, ..._ }
      })
    }
  })()
}
