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
      const saved = await Factor.$post.save({ post, postType: this.postType })
      this.send(form)
      return saved
    }

    async send(form) {
      const to = Factor.$setting.get("contactForm.email")()

      const text = Object.entries(form)
        .map(
          ([key, value]) =>
            `<p><div><strong>${Factor.$utils.toLabel(
              key
            )}</strong></div><div><i>${value}</i></div></p>`
        )
        .join("")

      return await Factor.$email.request("sendTransactional", {
        _id: "contact-form",
        to,
        subject: "Contact Form Submitted",
        text
      })
    }
  })()
}
