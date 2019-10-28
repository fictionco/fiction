import { requestPostSave } from "@factor/post"
import { toLabel, pushToFilter } from "@factor/tools"

export default Factor => {
  return new (class {
    constructor() {
      this.postType = "contact-form"
      this.filters()
    }

    filters() {
      pushToFilter("post-types", {
        postType: this.postType,
        nameIndex: "Contact Form",
        nameSingle: "Submitted",
        namePlural: "Contact Forms",
        listTemplate: () => import("./dashboard-list.vue"),
        add: false
      })
    }

    async save(form) {
      const post = { settings: form }
      const saved = await requestPostSave({ post, postType: this.postType })
      this.send(form)
      return saved
    }

    async send(form) {
      const toSetting = Factor.$setting.get("contactForm.email")
      const to = typeof toSetting == "function" ? toSetting() : toSetting

      const text = Object.entries(form)
        .map(
          ([key, value]) => `<p><strong>${toLabel(key)}</strong><br><i>${value}</i></p>`
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
