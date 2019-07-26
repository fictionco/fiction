export default Factor => {
  return new (class {
    constructor() {
      // image require wont work outside webpack
      const icon = Factor.FACTOR_TARGET == "app" ? require("./img/pages.svg") : ""

      Factor.$filters.add("post-types", _ => {
        _.unshift({
          type: "page",
          base: "",
          icon,
          nameIndex: "Pages",
          nameSingle: "Page",
          namePlural: "Pages",
          model: "Page"
        })
        return _
      })

      Factor.$filters.add("post-edit-components", _ => {
        _.push({
          type: ["page"],
          name: "Page Template Settings",
          component: () => import("./page-settings")
        })

        return _
      })

      Factor.$filters.add("content-routes-unmatched", _ => {
        _.unshift({
          path: "/:permalink",
          component: () => import("./template")
        })

        return _
      })

      // Add page templates
      Factor.$filters.add("register-components", _ => {
        _["templates"] = this.registerTemplates()
        return _
      })
    }

    async getTemplate(_id) {
      const _all = this.getPageTemplates()

      let tpl = _all.find(_ => _._id == _id)

      if (!tpl) {
        tpl = _all.find(_ => _._id == 'default')
      }

      tpl.settings = await this.getTemplateSettings(tpl)

      return tpl

    }

    async getTemplateSettings(tpl) {

      const { default: { templateSettings } } = await tpl.component()

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
      const tpls = [
        {
          _id: "default",
          component: () => import("./tpl-default")
        }
      ]

      return Factor.$filters.apply("page-templates", tpls).map(_ => {
        const name = _.name || Factor.$utils.toLabel(_._id.replace("tpl-", ""))
        return {
          name,
          ..._
        }
      })
    }
  })()
}
