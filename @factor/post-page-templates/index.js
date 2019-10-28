export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.push("data-schemas", () => require("./schema").default(Factor), {
        key: "page"
      })

      Factor.$filters.add("post-types", _ => {
        _.unshift({
          postType: "page",
          baseRoute: "",
          icon: require("./img/pages.svg"),
          nameIndex: "Pages",
          nameSingle: "Page",
          namePlural: "Pages",
          model: "Page"
        })
        return _
      })

      Factor.$filters.add("post-edit-components", _ => {
        _.push({
          postType: ["page"],
          name: "Page Template Settings",
          component: () => import("./page-settings.vue")
        })

        return _
      })

      Factor.$filters.add("content-routes-unmatched", _ => {
        _.unshift({
          path: "/:permalink",
          component: () => import("./template.vue")
        })

        return _
      })

      // Add page templates
      Factor.$filters.add("register-components", _ => {
        _["templates"] = this.registerTemplates()
        return _
      })
    }

    async getTemplate(templateId) {
      const _all = this.getPageTemplates()

      let tpl = _all.find(_ => _._id == templateId)

      if (!tpl) {
        tpl = _all.find(_ => _._id == "default")
      }

      tpl.fields = await this.getTemplateFields(tpl)

      return tpl
    }

    async getTemplateFields(tpl) {
      const {
        default: { templateSettings }
      } = await tpl.component()

      return templateSettings ? templateSettings() : []
    }

    // Register Page Templates added by theme or app
    registerTemplates() {
      this.pageTemplates = this.getPageTemplates()

      Factor.$filters.add("components", _ => {
        this.pageTemplates.forEach(tpl => {
          _[tpl.value] = tpl.component
        })

        return _
      })
    }

    getPageTemplates() {
      const tpls = Factor.$setting.get("pageTemplates.templates")

      return Factor.$filters
        .apply("page-templates", tpls)
        .filter((page, index, self) => {
          // remove duplicates, favor the last
          const lastIndexOf = self.map(_ => _._id).lastIndexOf(page._id)
          return index === lastIndexOf
        })
        .map(_ => {
          const name = _.name || Factor.$utils.toLabel(_._id.replace("tpl-", ""))
          return {
            name,
            ..._
          }
        })
    }
  })()
}
