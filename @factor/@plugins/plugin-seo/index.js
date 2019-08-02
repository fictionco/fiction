export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("post-edit-components", _ => {
        _.push({
          name: "SEO and Sharing",
          component: () => import("./seo-panel.vue")
        })

        return _
      })

      Factor.$filters.add("post-schema", _ => {
        return {
          ..._,
          titleTag: { type: String, trim: true },
          descriptionTag: { type: String, trim: true },
          shareImage: { type: Factor.$mongo.objectIdType(), ref: "attachment" }
        }
      })

      Factor.$filters.add("post-populated-fields", _ => {
        _.push({ field: "shareImage", depth: 20 })
        return _
      })
    }
  })()
}
