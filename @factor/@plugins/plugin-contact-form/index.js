export default Factor => {
  return new (class {
    constructor() {
      this.postType = "contact-form"
      this.filters()
    }

    filters() {
      Factor.$filters.add("post-types", _ => {
        _.push({
          postType: this.postType,
          nameIndex: "Contact Form",
          nameSingle: "Submitted",
          namePlural: "Contact Forms",
          listTemplate: () => import("./dashboard-list.vue"),
          add: false
        })

        return _
      })
    }

    async save(form) {
      const post = { settings: form }
      return await Factor.$post.save({ post, postType: this.postType })
    }
  })()
}
