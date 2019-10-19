import { objectIdType } from "@factor/post/util"

export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.push("post-edit-components", {
        name: "SEO and Sharing",
        component: () => import("./seo-panel.vue")
      })

      Factor.$filters.add("post-schema", _ => {
        return {
          ..._,
          titleTag: { type: String, trim: true },
          descriptionTag: { type: String, trim: true },
          shareImage: { type: objectIdType(), ref: "attachment" }
        }
      })

      Factor.$filters.add("post-populated-fields", _ => {
        _.push({ field: "shareImage", depth: 20 })
        return _
      })
    }
  })()
}
