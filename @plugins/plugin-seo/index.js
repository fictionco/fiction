import { objectIdType } from "@factor/post/util"
import { addFilter, pushToFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      pushToFilter("post-edit-components", {
        name: "SEO and Sharing",
        component: () => import("./seo-panel.vue")
      })

      addFilter("post-schema", _ => {
        return {
          ..._,
          titleTag: { type: String, trim: true },
          descriptionTag: { type: String, trim: true },
          shareImage: { type: objectIdType(), ref: "attachment" }
        }
      })

      addFilter("post-populated-fields", _ => {
        _.push({ field: "shareImage", depth: 20 })
        return _
      })
    }
  })()
}
