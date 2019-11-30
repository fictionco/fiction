import { requestPostSave } from "@factor/post"
import { toLabel, addPostType, setting } from "@factor/tools"
import { sendEmailRequest } from "@factor/email"

const postType = "contact-form"

addPostType({
  postType: postType,
  nameIndex: "Contact Form",
  nameSingle: "Submitted",
  namePlural: "Contact Forms",
  listTemplate: () => import("./dashboard-list.vue"),
  add: false
})

export async function saveContactForm(form: object): Promise<object> {
  const post = { settings: form }
  const saved = await requestPostSave({ post, postType: postType })
  sendFormEmail(form)
  return saved
}

export async function sendFormEmail(form: object): Promise<object> {
  const toSetting = setting("contactForm.email")
  const to = typeof toSetting == "function" ? toSetting() : toSetting

  const text = Object.entries(form)
    .map(([key, value]) => `<p><strong>${toLabel(key)}</strong><br><i>${value}</i></p>`)
    .join("")

  return await sendEmailRequest("sendTransactional", {
    _id: "contact-form",
    to,
    subject: "Contact Form Submitted",
    text
  })
}
